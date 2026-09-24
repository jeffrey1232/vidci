import { createSeed } from '../data/seed.js'
import { TX_STATUS, VIDEO_STATUS, VISITOR_ID } from '../utils/constants.js'
import { slugify, uid } from '../utils/format.js'

const DB_KEY = 'vidci_db_v1'
const SESSION_KEY = 'vidci_session_v1'
const listeners = new Set()

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function loadDb() {
  try {
    const raw = localStorage.getItem(DB_KEY)
    if (raw) return JSON.parse(raw)
  } catch {
    /* ignore */
  }
  return createSeed()
}

let db = typeof window === 'undefined' ? createSeed() : loadDb()

function persist() {
  localStorage.setItem(DB_KEY, JSON.stringify(db))
  listeners.forEach((fn) => fn())
}

export function subscribeStore(fn) {
  listeners.add(fn)
  return () => listeners.delete(fn)
}

export function getDb() {
  return db
}

export function resetDb() {
  db = createSeed()
  persist()
  return db
}

function wait(ms = 180) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function publicUser(user) {
  if (!user) return null
  const safe = { ...user }
  delete safe.password
  return safe
}

function categoryVideoCount(categoryId) {
  return db.videos.filter((v) => v.categoryId === categoryId).length
}

function withCategoryMeta(category) {
  return { ...category, videoCount: categoryVideoCount(category.id) }
}

function userStats(userId) {
  const purchases = db.purchases.filter((p) => p.userId === userId)
  const spent = purchases.reduce((sum, p) => sum + Number(p.price || 0), 0)
  return { purchasedCount: purchases.length, spentAmount: spent }
}

export function getSessionUser() {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw)
    const user = db.users.find((u) => u.id === session.userId)
    if (!user || user.status !== 'active') return null
    return publicUser(user)
  } catch {
    return null
  }
}

function setSession(userId) {
  const token = `mock.${btoa(userId)}.local`
  localStorage.setItem(SESSION_KEY, JSON.stringify({ userId, token }))
  return { token, user: publicUser(db.users.find((u) => u.id === userId)) }
}

export function clearSession() {
  localStorage.removeItem(SESSION_KEY)
}

export function hasPurchase(userId, videoId) {
  const purchase = db.purchases.find((p) => p.userId === userId && p.videoId === videoId)
  if (!purchase) return false
  
  // Vérifier si l'achat est encore valide (40 minutes)
  const purchaseTime = new Date(purchase.purchasedAt).getTime()
  const currentTime = new Date().getTime()
  const fortyMinutesInMs = 40 * 60 * 1000 // 40 minutes en millisecondes
  
  return (currentTime - purchaseTime) < fortyMinutesInMs
}

export function getPurchase(userId, videoId) {
  return db.purchases.find((p) => p.userId === userId && p.videoId === videoId)
}

export function getRemainingTime(userId, videoId) {
  const purchase = getPurchase(userId, videoId)
  if (!purchase) return null
  
  const purchaseTime = new Date(purchase.purchasedAt).getTime()
  const currentTime = new Date().getTime()
  const fortyMinutesInMs = 40 * 60 * 1000
  const remaining = fortyMinutesInMs - (currentTime - purchaseTime)
  
  return remaining > 0 ? remaining : 0
}

export function getCustomerId() {
  if (!db.users.some((u) => u.id === VISITOR_ID)) {
    db.users.push({
      id: VISITOR_ID,
      firstName: 'Visiteur',
      lastName: 'VIDCI',
      email: 'visiteur@vidci.ci',
      phone: '+225 00 00 00 00 00',
      password: '',
      role: 'USER',
      avatar: 'https://i.pravatar.cc/150?u=visitor',
      status: 'active',
      createdAt: new Date().toISOString(),
    })
    if (typeof window !== 'undefined') {
      localStorage.setItem(DB_KEY, JSON.stringify(db))
    }
  }
  return VISITOR_ID
}

export function canAccessVideo(user, video) {
  if (!video) return false
  if (video.type === 'free' && video.status === VIDEO_STATUS.PUBLISHED) return true
  if (user?.role === 'ADMIN') return true
  return hasPurchase(getCustomerId(), video.id)
}

export const mockApi = {
  async login({ email, password }) {
    await wait()
    const user = db.users.find(
      (u) => u.email.toLowerCase() === String(email).toLowerCase() && u.password === password,
    )
    if (!user) {
      const error = new Error('Email ou mot de passe incorrect.')
      error.status = 401
      throw error
    }
    if (user.status !== 'active') {
      const error = new Error('Ce compte est désactivé.')
      error.status = 403
      throw error
    }
    return setSession(user.id)
  },

  async register(payload) {
    await wait()
    const exists = db.users.some((u) => u.email.toLowerCase() === payload.email.toLowerCase())
    if (exists) {
      const error = new Error('Un compte existe déjà avec cet email.')
      error.status = 409
      throw error
    }
    const user = {
      id: uid('usr'),
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      password: payload.password,
      role: 'USER',
      avatar: payload.avatar || `https://i.pravatar.cc/150?u=${encodeURIComponent(payload.email)}`,
      status: 'active',
      createdAt: new Date().toISOString(),
    }
    db.users.unshift(user)
    persist()
    return setSession(user.id)
  },

  async forgotPassword(email) {
    await wait(400)
    const user = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())
    return {
      ok: true,
      message: user
        ? 'Si un compte existe, un lien de réinitialisation a été préparé (simulation).'
        : 'Si un compte existe, un lien de réinitialisation a été préparé (simulation).',
    }
  },

  async updateProfile(userId, payload) {
    await wait()
    const user = db.users.find((u) => u.id === userId)
    if (!user) throw new Error('Utilisateur introuvable.')
    Object.assign(user, {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      phone: payload.phone,
      avatar: payload.avatar || user.avatar,
    })
    persist()
    return publicUser(user)
  },

  listCategories() {
    return db.categories.map(withCategoryMeta)
  },

  getCategory(idOrSlug) {
    const category = db.categories.find((c) => c.id === idOrSlug || c.slug === idOrSlug)
    return category ? withCategoryMeta(category) : null
  },

  async createCategory(payload) {
    await wait()
    const category = {
      id: uid('cat'),
      name: payload.name,
      slug: slugify(payload.name),
      description: payload.description,
      image: payload.image,
      createdAt: new Date().toISOString(),
    }
    db.categories.unshift(category)
    persist()
    return withCategoryMeta(category)
  },

  async updateCategory(id, payload) {
    await wait()
    const category = db.categories.find((c) => c.id === id)
    if (!category) throw new Error('Catégorie introuvable.')
    Object.assign(category, {
      name: payload.name,
      slug: slugify(payload.name),
      description: payload.description,
      image: payload.image,
    })
    persist()
    return withCategoryMeta(category)
  },

  async deleteCategory(id) {
    await wait()
    db.videos.forEach((video) => {
      if (video.categoryId === id) video.categoryId = ''
    })
    db.categories = db.categories.filter((c) => c.id !== id)
    persist()
  },

  listVideos({ includeDrafts = false } = {}) {
    return db.videos
      .filter((v) => includeDrafts || v.status === VIDEO_STATUS.PUBLISHED)
      .map((v) => clone(v))
  },

  getVideo(id, { includeDrafts = false } = {}) {
    const video = db.videos.find((v) => v.id === id)
    if (!video) return null
    if (!includeDrafts && video.status !== VIDEO_STATUS.PUBLISHED) return null
    return clone(video)
  },

  async createVideo(payload) {
    await wait()
    const type = payload.type === 'free' ? 'free' : 'paid'
    const video = {
      id: uid('vid'),
      title: payload.title,
      description: payload.description,
      categoryId: payload.categoryId,
      thumbnail: payload.thumbnail,
      videoUrl: payload.videoUrl,
      price: type === 'free' ? 0 : Number(payload.price) || 0,
      type,
      durationSeconds: Number(payload.durationSeconds) || 0,
      author: payload.author,
      status: payload.status === VIDEO_STATUS.PUBLISHED ? VIDEO_STATUS.PUBLISHED : VIDEO_STATUS.DRAFT,
      publishedAt:
        payload.status === VIDEO_STATUS.PUBLISHED
          ? payload.publishedAt || new Date().toISOString()
          : null,
      views: 0,
      salesCount: 0,
    }
    db.videos.unshift(video)
    persist()
    return clone(video)
  },

  async updateVideo(id, payload) {
    await wait()
    const video = db.videos.find((v) => v.id === id)
    if (!video) throw new Error('Vidéo introuvable.')
    const type = payload.type === 'free' ? 'free' : 'paid'
    Object.assign(video, {
      title: payload.title,
      description: payload.description,
      categoryId: payload.categoryId,
      thumbnail: payload.thumbnail,
      videoUrl: payload.videoUrl,
      type,
      price: type === 'free' ? 0 : Number(payload.price) || 0,
      durationSeconds: Number(payload.durationSeconds) || 0,
      author: payload.author,
      status: payload.status,
      publishedAt:
        payload.status === VIDEO_STATUS.PUBLISHED
          ? video.publishedAt || payload.publishedAt || new Date().toISOString()
          : video.publishedAt,
    })
    persist()
    return clone(video)
  },

  async toggleVideoStatus(id) {
    await wait()
    const video = db.videos.find((v) => v.id === id)
    if (!video) throw new Error('Vidéo introuvable.')
    if (video.status === VIDEO_STATUS.PUBLISHED) {
      video.status = VIDEO_STATUS.DRAFT
    } else {
      video.status = VIDEO_STATUS.PUBLISHED
      video.publishedAt = video.publishedAt || new Date().toISOString()
    }
    persist()
    return clone(video)
  },

  async deleteVideo(id) {
    await wait()
    db.videos = db.videos.filter((v) => v.id !== id)
    persist()
  },

  async incrementViews(id) {
    const video = db.videos.find((v) => v.id === id)
    if (!video) return
    video.views += 1
    persist()
  },

  listUsers() {
    return db.users.map((u) => ({ ...publicUser(u), ...userStats(u.id) }))
  },

  getUser(id) {
    const user = db.users.find((u) => u.id === id)
    if (!user) return null
    return { ...publicUser(user), ...userStats(user.id) }
  },

  async setUserStatus(id, status) {
    await wait()
    const user = db.users.find((u) => u.id === id)
    if (!user) throw new Error('Utilisateur introuvable.')
    if (user.role === 'ADMIN') throw new Error('Impossible de désactiver un administrateur.')
    user.status = status
    persist()
    return { ...publicUser(user), ...userStats(user.id) }
  },

  listTransactions() {
    return clone(db.transactions).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  },

  getTransaction(id) {
    const tx = db.transactions.find((t) => t.id === id)
    return tx ? clone(tx) : null
  },

  listPurchases(userId) {
    return db.purchases
      .filter((p) => p.userId === userId)
      .map((p) => clone(p))
      .sort((a, b) => new Date(b.purchasedAt) - new Date(a.purchasedAt))
  },

  async simulatePayment({ userId, videoId, method }) {
    await wait(700)
    const buyerId = userId || getCustomerId()
    const video = db.videos.find((v) => v.id === videoId)
    const user = db.users.find((u) => u.id === buyerId)
    if (!video || !user) throw new Error('Achat impossible.')
    if (video.type === 'free') throw new Error('Cette vidéo est déjà gratuite.')
    if (hasPurchase(buyerId, videoId)) {
      return {
        alreadyOwned: true,
        purchase: db.purchases.find((p) => p.userId === buyerId && p.videoId === videoId),
      }
    }

    const transaction = {
      id: uid('trx'),
      userId: buyerId,
      videoId,
      amount: Number(video.price),
      method,
      status: TX_STATUS.PAID,
      createdAt: new Date().toISOString(),
      simulated: true,
    }
    db.transactions.unshift(transaction)
    const purchase = {
      id: uid('pur'),
      userId: buyerId,
      videoId,
      transactionId: transaction.id,
      price: transaction.amount,
      purchasedAt: transaction.createdAt,
    }
    db.purchases.unshift(purchase)
    video.salesCount += 1
    persist()
    return { alreadyOwned: false, transaction, purchase }
  },

  getStats() {
    const paid = db.transactions.filter((t) => t.status === TX_STATUS.PAID)
    const revenue = paid.reduce((sum, t) => sum + Number(t.amount), 0)
    const topVideos = [...db.videos]
      .filter((v) => v.salesCount > 0)
      .sort((a, b) => b.salesCount - a.salesCount)
      .slice(0, 5)
    const latestUsers = [...db.users]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map((u) => ({ ...publicUser(u), ...userStats(u.id) }))
    const latestTransactions = this.listTransactions().slice(0, 6)

    const byDay = {}
    paid.forEach((t) => {
      const day = t.createdAt.slice(0, 10)
      byDay[day] = (byDay[day] || 0) + Number(t.amount)
    })
    const revenueSeries = Object.entries(byDay)
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-8)
      .map(([label, value]) => ({ label: label.slice(5), value }))

    const byCategory = db.categories.map((c) => ({
      label: c.name,
      value: db.videos.filter((v) => v.categoryId === c.id).reduce((s, v) => s + v.salesCount, 0),
    }))

    return {
      users: db.users.length,
      videos: db.videos.length,
      categories: db.categories.length,
      sales: paid.length,
      revenue,
      topVideos,
      latestUsers,
      latestTransactions,
      revenueSeries,
      byCategory,
    }
  },
}
