import { mockApi } from './mockStore.js'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'
const API_BASE = import.meta.env.VITE_API_URL || '/api'

async function realRequest(method, path, body) {
  const session = JSON.parse(localStorage.getItem('vidci_session_v1') || 'null')
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(session?.token ? { Authorization: `Bearer ${session.token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}))
    throw new Error(payload.message || 'Erreur réseau')
  }
  if (response.status === 204) return null
  return response.json()
}

export const api = {
  useMock: USE_MOCK,
  mock: mockApi,
  async get() {
    if (USE_MOCK) throw new Error('Utilisez les services dédiés en mode mock.')
    return realRequest('GET', arguments[0])
  },
}
