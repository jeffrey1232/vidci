import { mockApi } from './mockStore.js'

export const videosService = {
  list: (options) => mockApi.listVideos(options),
  get: (id, options) => mockApi.getVideo(id, options),
  create: (payload) => mockApi.createVideo(payload),
  update: (id, payload) => mockApi.updateVideo(id, payload),
  remove: (id) => mockApi.deleteVideo(id),
  toggleStatus: (id) => mockApi.toggleVideoStatus(id),
  incrementViews: (id) => mockApi.incrementViews(id),
}
