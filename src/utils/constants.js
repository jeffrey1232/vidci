export const ROLES = {
  USER: 'USER',
  ADMIN: 'ADMIN',
}

export const VIDEO_TYPES = {
  FREE: 'free',
  PAID: 'paid',
}

export const VIDEO_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
}

export const TX_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
}

export const PAYMENT_METHODS = [
  { id: 'orange_money', label: 'Orange Money', hint: 'Paiement mobile Orange CI' },
  { id: 'mtn_money', label: 'MTN Mobile Money', hint: 'Paiement mobile MTN CI' },
  { id: 'moov_money', label: 'Moov Money', hint: 'Paiement mobile Moov CI' },
  { id: 'wave', label: 'Wave', hint: 'Portefeuille Wave' },
  { id: 'card', label: 'Carte bancaire', hint: 'Visa / Mastercard' },
]

export const VISITOR_ID = 'usr-visitor'

export const SAMPLE_VIDEOS = [
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
  'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4',
]
