import { Link, useParams } from 'react-router-dom'
import Badge from '../../components/common/Badge.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { paymentsService } from '../../services/payments.js'
import { PAYMENT_METHODS } from '../../utils/constants.js'
import { formatDateTime, formatFcfa } from '../../utils/format.js'

const tones = { pending: 'pending', paid: 'paid_tx', failed: 'failed', refunded: 'refunded' }
const labels = { pending: 'En attente', paid: 'Payé', failed: 'Échoué', refunded: 'Remboursé' }

export default function AdminTransactionDetailPage() {
  const { id } = useParams()
  const tx = paymentsService.get(id)
  const { users, videos } = useStore()
  if (!tx) return <EmptyState title="Transaction introuvable" />

  const user = users.find((u) => u.id === tx.userId)
  const video = videos.find((v) => v.id === tx.videoId)
  const method = PAYMENT_METHODS.find((m) => m.id === tx.method)

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <h1 className="font-display text-3xl font-bold">Transaction</h1>
      <Badge tone={tones[tx.status]}>{labels[tx.status]}</Badge>
      <p className="text-sm text-zinc-400">{tx.id}</p>
      <p>
        Utilisateur :{' '}
        <Link className="text-brand-300" to={`/admin/users/${tx.userId}`}>
          {user ? `${user.firstName} ${user.lastName}` : tx.userId}
        </Link>
      </p>
      <p>
        Vidéo :{' '}
        <Link className="text-brand-300" to={`/admin/videos/${tx.videoId}`}>
          {video?.title || tx.videoId}
        </Link>
      </p>
      <p>Prix : {formatFcfa(tx.amount)}</p>
      <p>Date : {formatDateTime(tx.createdAt)}</p>
      <p>Méthode : {method?.label || tx.method}</p>
      {tx.simulated ? (
        <p className="rounded-xl border border-amber-400/30 bg-amber-400/10 p-3 text-sm">
          Transaction de démonstration. Aucun paiement réel n’a été encaissé.
        </p>
      ) : null}
    </div>
  )
}
