import { Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import Badge from '../../components/common/Badge.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { usersService } from '../../services/users.js'
import { formatDate, formatFcfa } from '../../utils/format.js'

export default function AdminUsersPage() {
  useStore()
  const users = usersService.list()

  return (
    <div>
      <h1 className="mb-6 font-display text-3xl font-bold">Utilisateurs</h1>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="p-3">Nom</th>
              <th>Email</th>
              <th>Téléphone</th>
              <th>Inscription</th>
              <th>Achats</th>
              <th>Dépensé</th>
              <th>Statut</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-white/10">
                <td className="p-3">
                  {u.firstName} {u.lastName}
                </td>
                <td>{u.email}</td>
                <td>{u.phone}</td>
                <td>{formatDate(u.createdAt)}</td>
                <td>{u.purchasedCount}</td>
                <td>{formatFcfa(u.spentAmount)}</td>
                <td>
                  <Badge tone={u.status === 'active' ? 'active' : 'inactive'}>
                    {u.status === 'active' ? 'Actif' : 'Désactivé'}
                  </Badge>
                </td>
                <td className="p-3">
                  <Link to={`/admin/users/${u.id}`}>
                    <Eye size={16} />
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
