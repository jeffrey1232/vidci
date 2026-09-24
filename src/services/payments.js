import { mockApi } from './mockStore.js'

/**
 * Paiement simulé uniquement. Aucun débit réel.
 * À remplacer par POST /api/payments vers un PSP (Orange Money, MTN, Wave, carte).
 */
export const paymentsService = {
  simulate: (payload) => mockApi.simulatePayment(payload),
  list: () => mockApi.listTransactions(),
  get: (id) => mockApi.getTransaction(id),
}

export const statsService = {
  dashboard: () => mockApi.getStats(),
}
