import { CheckCircle2 } from 'lucide-react'
import { Link, useParams } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import { videosService } from '../../services/videos.js'

export default function PaymentSuccessPage() {
  const { videoId } = useParams()
  const video = videosService.get(videoId)

  return (
    <div className="mx-auto max-w-lg px-4 py-16 text-center">
      <CheckCircle2 className="mx-auto text-emerald-400" size={56} />
      <h1 className="mt-4 font-display text-3xl font-bold">Paiement effectué avec succès !</h1>
      <p className="mt-3 text-zinc-300">Vous pouvez maintenant regarder cette vidéo.</p>
      {video ? (
        <Button as={Link} to={`/watch/${video.id}`} className="mt-8">
          Regarder la vidéo
        </Button>
      ) : null}
      <Button as={Link} to="/mes-achats" variant="ghost" className="mt-3">
        Voir mes achats
      </Button>
    </div>
  )
}
