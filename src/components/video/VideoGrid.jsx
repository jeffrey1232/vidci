import { useAuth } from '../../context/AuthContext.jsx'
import { purchasesService } from '../../services/purchases.js'
import VideoCard from './VideoCard.jsx'

export default function VideoGrid({ videos, categories }) {
  const { user } = useAuth()
  const names = Object.fromEntries(categories.map((c) => [c.id, c.name]))
  return (
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          categoryName={names[video.categoryId] || 'Catégorie'}
          canWatch={purchasesService.canAccess(user, video)}
        />
      ))}
    </div>
  )
}
