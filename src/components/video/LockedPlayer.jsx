import { Lock } from 'lucide-react'
import { Link } from 'react-router-dom'
import Button from '../common/Button.jsx'
import { formatFcfa } from '../../utils/format.js'

export default function LockedPlayer({ video }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10">
      <img src={video.thumbnail} alt="" className="aspect-video w-full object-cover blur-[2px] brightness-50" />
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/45 p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-400 text-ink-950">
          <Lock size={28} />
        </div>
        <h2 className="font-display text-2xl font-semibold">Cette vidéo est payante</h2>
        <p className="text-lg font-medium text-amber-300">Prix : {formatFcfa(video.price)}</p>
        <p className="max-w-md text-sm text-zinc-300">
          Achetez cette vidéo pour accéder immédiatement au contenu.
        </p>
        <Button as={Link} to={`/checkout/${video.id}`} variant="gold">
          Acheter la vidéo
        </Button>
      </div>
    </div>
  )
}
