import { Link } from 'react-router-dom'
import { Clock, Lock } from 'lucide-react'
import Badge from '../common/Badge.jsx'
import Button from '../common/Button.jsx'
import { formatDuration, formatFcfa } from '../../utils/format.js'
import { useAuth } from '../../context/AuthContext.jsx'
import { usePaymentModal } from '../../context/PaymentModalContext.jsx'
import { purchasesService } from '../../services/purchases.js'

export default function VideoCard({ video, categoryName, canWatch = false }) {
  const paid = video.type === 'paid'
  const { user } = useAuth()
  const { openPaymentModal } = usePaymentModal()

  const handlePaymentSuccess = () => {
    if (video) {
      const userId = user?.id || purchasesService.customerId()
      purchasesService.create(userId, video.id)
    }
  }

  const handleButtonClick = (e) => {
    if (paid) {
      e.preventDefault()
      openPaymentModal(video, handlePaymentSuccess)
    }
  }

  return (
    <article className="group overflow-hidden rounded-3xl border-2 border-purple-200 bg-white/90 shadow-xl shadow-purple-200/50 transition hover:-translate-y-2 hover:border-purple-400 hover:shadow-purple-300/60">
      <Link to={`/videos/${video.id}`} className="block">
        <div className="relative aspect-video overflow-hidden">
          <img
            src={video.thumbnail}
            alt=""
            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
          />
          <div className="absolute left-3 top-3">
            <Badge tone={paid ? 'paid' : 'free'}>{paid ? 'Payant' : 'Gratuit'}</Badge>
          </div>
          <div className="absolute bottom-3 right-3 rounded-full bg-purple-400/90 px-3 py-1 text-xs text-white backdrop-blur-sm">
            {formatDuration(video.durationSeconds)}
          </div>
        </div>
      </Link>
      <div className="space-y-3 p-5">
        <p className="text-xs uppercase tracking-wider text-purple-500 font-semibold">{categoryName}</p>
        <Link to={`/videos/${video.id}`}>
          <h3 className="font-display text-xl font-bold leading-snug text-ink-900">{video.title}</h3>
        </Link>
        <p className="line-clamp-2 text-sm text-ink-600">{video.description}</p>
        <div className="flex items-center justify-between text-sm text-ink-700">
          <span className="inline-flex items-center gap-1 text-purple-600">
            <Clock size={14} /> {formatDuration(video.durationSeconds)}
          </span>
          <span className="font-bold text-purple-500">
            {paid ? formatFcfa(video.price) : 'Gratuit'}
          </span>
        </div>
        {paid ? (
          <Button onClick={handleButtonClick} className="w-full">
            <Lock size={16} /> Regarder
          </Button>
        ) : (
          <Button as={Link} to={`/watch/${video.id}`} className="w-full">
            Regarder
          </Button>
        )}
      </div>
    </article>
  )
}
