import { Clock, ShoppingBag, User } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import LockedPlayer from '../../components/video/LockedPlayer.jsx'
import VideoPlayer from '../../components/video/VideoPlayer.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { usePaymentModal } from '../../context/PaymentModalContext.jsx'
import { categoriesService } from '../../services/categories.js'
import { purchasesService } from '../../services/purchases.js'
import { videosService } from '../../services/videos.js'
import { formatDuration, formatFcfa } from '../../utils/format.js'

export default function VideoDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { openPaymentModal } = usePaymentModal()
  useStore()
  const video = videosService.get(id)
  const category = video ? categoriesService.get(video.categoryId) : null
  const canWatch = video ? purchasesService.canAccess(user, video) : false

  const handlePaymentSuccess = () => {
    if (video) {
      const userId = user?.id || purchasesService.customerId()
      purchasesService.create(userId, video.id)
    }
  }

  if (!video) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-10">
        <EmptyState title="Vidéo introuvable" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      {canWatch ? (
        <VideoPlayer src={video.videoUrl} poster={video.thumbnail} title={video.title} />
      ) : (
        <LockedPlayer video={video} />
      )}
      <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={video.type === 'paid' ? 'paid' : 'free'}>
              {video.type === 'paid' ? 'Payant' : 'Gratuit'}
            </Badge>
            {category ? <Badge>{category.name}</Badge> : null}
          </div>
          <h1 className="mt-3 font-display text-4xl font-bold">{video.title}</h1>
          <p className="mt-3 max-w-3xl text-zinc-300">{video.description}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-right">
          <p className="text-2xl font-semibold">
            {video.type === 'paid' ? formatFcfa(video.price) : 'Gratuit'}
          </p>
          {video.type === 'paid' ? (
            <Button onClick={() => openPaymentModal(video, handlePaymentSuccess)} variant="gold" className="mt-3">
              Regarder
            </Button>
          ) : (
            <Button as={Link} to={`/watch/${video.id}`} className="mt-3">
              Regarder
            </Button>
          )}
        </div>
      </div>
      <dl className="mt-8 grid gap-4 sm:grid-cols-4">
        <Info label="Auteur" value={video.author} icon={User} />
        <Info label="Durée" value={formatDuration(video.durationSeconds)} icon={Clock} />
        <Info label="Ventes" value={String(video.salesCount)} icon={ShoppingBag} />
        <Info label="Vues" value={String(video.views)} />
      </dl>
    </div>
  )
}

function Info({ label, value, icon: Icon }) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
      <p className="text-xs uppercase tracking-wide text-zinc-500">{label}</p>
      <p className="mt-1 inline-flex items-center gap-2 font-medium">
        {Icon ? <Icon size={16} /> : null}
        {value}
      </p>
    </div>
  )
}
