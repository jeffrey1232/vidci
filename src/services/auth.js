import { clearSession, mockApi } from './mockStore.js'

export const authService = {
  login: (payload) => mockApi.login(payload),
  register: (payload) => mockApi.register(payload),
  forgotPassword: (email) => mockApi.forgotPassword(email),
  logout: () => clearSession(),
  updateProfile: (userId, payload) => mockApi.updateProfile(userId, payload),
}
