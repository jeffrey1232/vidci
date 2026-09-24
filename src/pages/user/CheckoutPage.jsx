import { useState } from 'react'
import { Link, Navigate, useNavigate, useParams } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { paymentsService } from '../../services/payments.js'
import { purchasesService } from '../../services/purchases.js'
import { videosService } from '../../services/videos.js'
import { PAYMENT_METHODS } from '../../utils/constants.js'
import { formatFcfa } from '../../utils/format.js'

export default function CheckoutPage() {
  const { videoId } = useParams()
  const video = videosService.get(videoId)
  const { user } = useAuth()
  useStore()
  const toast = useToast()
  const navigate = useNavigate()
  const [method, setMethod] = useState('wave')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)

  if (!video) {
    return (
      <div className="mx-auto max-w-xl px-4 py-10">
        <EmptyState title="Vidéo introuvable" />
      </div>
    )
  }

  if (video.type === 'free' || purchasesService.canAccess(user, video)) {
    return <Navigate to={`/watch/${video.id}`} replace />
  }

  async function pay() {
    setLoading(true)
    try {
      const result = await paymentsService.simulate({
        userId: purchasesService.customerId(),
        videoId: video.id,
        method,
      })
      toast.success(result.alreadyOwned ? 'Vous possédez déjà cette vidéo.' : 'Paiement simulé confirmé.')
      navigate(`/checkout/${video.id}/succes`)
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold">Résumé de votre achat</h1>
      <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
        <img src={video.thumbnail} alt="" className="h-40 w-full object-cover" />
        <div className="space-y-3 p-5">
          <p>
            <span className="text-zinc-400">Vidéo :</span> {video.title}
          </p>
          <p>
            <span className="text-zinc-400">Prix :</span> {formatFcfa(video.price)}
          </p>
          <p className="text-lg font-semibold">Total : {formatFcfa(video.price)}</p>
        </div>
      </div>

      <div className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100">
        Simulation de paiement — aucun débit réel. Ce parcours prépare l’intégration Orange Money, MTN,
        Moov, Wave ou carte bancaire.
      </div>

      <fieldset className="mt-6 space-y-2">
        <legend className="mb-2 text-sm font-medium">Méthode (simulation)</legend>
        {PAYMENT_METHODS.map((item) => (
          <label
            key={item.id}
            className="flex cursor-pointer items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-3"
          >
            <input
              type="radio"
              name="method"
              value={item.id}
              checked={method === item.id}
              onChange={() => setMethod(item.id)}
            />
            <span>
              <span className="block font-medium">{item.label}</span>
              <span className="text-xs text-zinc-400">{item.hint}</span>
            </span>
          </label>
        ))}
      </fieldset>

      {method !== 'card' ? (
        <label className="mt-4 block text-sm">
          Numéro Mobile Money
          <input
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 h-11 w-full rounded-xl border border-white/10 bg-white/5 px-3"
          />
        </label>
      ) : null}

      <Button type="button" variant="gold" className="mt-6 w-full" disabled={loading} onClick={pay}>
        {loading ? 'Traitement...' : 'Payer maintenant'}
      </Button>
      <Link to={`/videos/${video.id}`} className="mt-4 block text-center text-sm text-zinc-400">
        Retour à la vidéo
      </Link>
    </div>
  )
}
