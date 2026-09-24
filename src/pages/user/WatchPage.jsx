import { useParams } from 'react-router-dom'
import EmptyState from '../../components/common/EmptyState.jsx'
import LockedPlayer from '../../components/video/LockedPlayer.jsx'
import VideoPlayer from '../../components/video/VideoPlayer.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { categoriesService } from '../../services/categories.js'
import { purchasesService } from '../../services/purchases.js'
import { videosService } from '../../services/videos.js'
import { formatDuration } from '../../utils/format.js'

export default function WatchPage() {
  const { id } = useParams()
  const { user } = useAuth()
  useStore()
  const video = videosService.get(id, { includeDrafts: user?.role === 'ADMIN' })
  const category = video ? categoriesService.get(video.categoryId) : null

  if (!video) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <EmptyState title="Vidéo introuvable" />
      </div>
    )
  }

  const allowed = purchasesService.canAccess(user, video)
  if (video.type === 'paid' && !allowed) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <LockedPlayer video={video} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <VideoPlayer
        src={video.videoUrl}
        poster={video.thumbnail}
        title={video.title}
        onStarted={() => videosService.incrementViews(video.id)}
      />
      <h1 className="mt-6 font-display text-3xl font-bold">{video.title}</h1>
      <p className="mt-2 text-sm text-zinc-400">
        {category?.name} · {formatDuration(video.durationSeconds)}
      </p>
      <p className="mt-4 text-zinc-300">{video.description}</p>
    </div>
  )
}
