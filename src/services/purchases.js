import { canAccessVideo, getCustomerId, mockApi } from './mockStore.js'

export const purchasesService = {
  customerId: () => getCustomerId(),
  mine: (userId = getCustomerId()) => mockApi.listPurchases(userId),
  canAccess: (user, video) => canAccessVideo(user, video),
  create: (userId, videoId) => {
    const customerUserId = userId || getCustomerId()
    return mockApi.simulatePayment({ userId: customerUserId, videoId, method: 'wave' })
  },
}
