import { Clapperboard, FolderTree, ShoppingBag, Users, Wallet } from 'lucide-react'
import { Link } from 'react-router-dom'
import BarChart from '../../components/admin/BarChart.jsx'
import LineChart from '../../components/admin/LineChart.jsx'
import StatCard from '../../components/admin/StatCard.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { formatDateTime, formatFcfa } from '../../utils/format.js'

export default function AdminDashboardPage() {
  const { stats, videos, users } = useStore()
  const names = Object.fromEntries(users.map((u) => [u.id, `${u.firstName} ${u.lastName}`]))
  const videoNames = Object.fromEntries(videos.map((v) => [v.id, v.title]))

  return (
    <div className="space-y-6">
      <h1 className="font-display text-3xl font-bold">Dashboard</h1>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Users} label="Utilisateurs" value={stats.users} />
        <StatCard icon={Clapperboard} label="Vidéos" value={stats.videos} />
        <StatCard icon={FolderTree} label="Catégories" value={stats.categories} />
        <StatCard icon={ShoppingBag} label="Ventes" value={stats.sales} />
        <StatCard icon={Wallet} label="Chiffre d’affaires" value={formatFcfa(stats.revenue)} />
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-3 font-semibold">Évolution du CA</h2>
          <LineChart data={stats.revenueSeries.length ? stats.revenueSeries : [{ label: '—', value: 0 }]} />
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-3 font-semibold">Ventes par catégorie</h2>
          <BarChart data={stats.byCategory} />
        </section>
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-3 font-semibold">Vidéos les plus vendues</h2>
          <ul className="space-y-2 text-sm">
            {stats.topVideos.map((v) => (
              <li key={v.id} className="flex justify-between rounded-xl bg-black/20 px-3 py-2">
                <Link to={`/admin/videos/${v.id}`}>{v.title}</Link>
                <span>{v.salesCount} ventes</span>
              </li>
            ))}
          </ul>
        </section>
        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-3 font-semibold">Derniers inscrits</h2>
          <ul className="space-y-2 text-sm">
            {stats.latestUsers.map((u) => (
              <li key={u.id} className="flex justify-between rounded-xl bg-black/20 px-3 py-2">
                <Link to={`/admin/users/${u.id}`}>
                  {u.firstName} {u.lastName}
                </Link>
                <span className="text-zinc-400">{formatDateTime(u.createdAt)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
      <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
        <h2 className="mb-3 font-semibold">Dernières transactions</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="text-zinc-400">
              <tr>
                <th className="py-2">ID</th>
                <th>Utilisateur</th>
                <th>Vidéo</th>
                <th>Montant</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {stats.latestTransactions.map((t) => (
                <tr key={t.id} className="border-t border-white/10">
                  <td className="py-2">
                    <Link to={`/admin/transactions/${t.id}`} className="text-brand-300">
                      {t.id}
                    </Link>
                  </td>
                  <td>{names[t.userId] || t.userId}</td>
                  <td>{videoNames[t.videoId] || t.videoId}</td>
                  <td>{formatFcfa(t.amount)}</td>
                  <td className="capitalize">{t.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
