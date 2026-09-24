import { ROLES, VISITOR_ID } from '../utils/constants.js'

const avatar = (n) => `https://i.pravatar.cc/150?img=${n}`

export function createSeed() {
  const categories = []

  const videos = []

  const users = [
    {
      id: VISITOR_ID,
      firstName: 'Visiteur',
      lastName: 'VIDCI',
      email: 'visiteur@vidci.ci',
      phone: '+225 00 00 00 00 00',
      password: '',
      role: ROLES.USER,
      avatar: avatar(1),
      status: 'active',
      createdAt: '2025-10-01T08:00:00.000Z',
    },
    {
      id: 'usr-admin',
      firstName: 'Admin',
      lastName: 'VIDCI',
      email: 'admin@vidci.ci',
      phone: '+225 07 00 00 00 01',
      password: 'Admin123!',
      role: ROLES.ADMIN,
      avatar: avatar(32),
      status: 'active',
      createdAt: '2025-10-01T08:00:00.000Z',
    },
  ]

  const transactions = []

  const purchases = []

  return { categories, videos, users, transactions, purchases }
}
