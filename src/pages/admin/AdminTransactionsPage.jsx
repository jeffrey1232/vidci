import { Link } from 'react-router-dom'
import Badge from '../../components/common/Badge.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { paymentsService } from '../../services/payments.js'
import { PAYMENT_METHODS } from '../../utils/constants.js'
import { formatDateTime, formatFcfa } from '../../utils/format.js'

const tones = { pending: 'pending', paid: 'paid_tx', failed: 'failed', refunded: 'refunded' }
const labels = { pending: 'En attente', paid: 'Payé', failed: 'Échoué', refunded: 'Remboursé' }

export default function AdminTransactionsPage() {
  const transactions = paymentsService.list()
  const { users, videos } = useStore()
  const userNames = Object.fromEntries(users.map((u) => [u.id, `${u.firstName} ${u.lastName}`]))
  const videoNames = Object.fromEntries(videos.map((v) => [v.id, v.title]))
  const methods = Object.fromEntries(PAYMENT_METHODS.map((m) => [m.id, m.label]))

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold">Transactions / Ventes</h1>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[980px] text-left text-sm">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="p-3">ID</th>
              <th>Utilisateur</th>
              <th>Vidéo</th>
              <th>Prix</th>
              <th>Date</th>
              <th>Méthode</th>
              <th>Statut</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t border-white/10">
                <td className="p-3">
                  <Link to={`/admin/transactions/${t.id}`} className="text-brand-300">
                    {t.id}
                  </Link>
                </td>
                <td>{userNames[t.userId]}</td>
                <td>{videoNames[t.videoId]}</td>
                <td>{formatFcfa(t.amount)}</td>
                <td>{formatDateTime(t.createdAt)}</td>
                <td>{methods[t.method] || t.method}</td>
                <td>
                  <Badge tone={tones[t.status]}>{labels[t.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
