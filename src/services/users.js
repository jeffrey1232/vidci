import { mockApi } from './mockStore.js'

export const usersService = {
  list: () => mockApi.listUsers(),
  get: (id) => mockApi.getUser(id),
  setStatus: (id, status) => mockApi.setUserStatus(id, status),
}
