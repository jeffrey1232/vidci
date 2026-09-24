import { mockApi } from './mockStore.js'

export const categoriesService = {
  list: () => mockApi.listCategories(),
  get: (idOrSlug) => mockApi.getCategory(idOrSlug),
  create: (payload) => mockApi.createCategory(payload),
  update: (id, payload) => mockApi.updateCategory(id, payload),
  remove: (id) => mockApi.deleteCategory(id),
}
