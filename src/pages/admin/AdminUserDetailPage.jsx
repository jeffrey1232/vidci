import { useParams } from 'react-router-dom'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { usersService } from '../../services/users.js'
import { formatDate, formatFcfa } from '../../utils/format.js'

export default function AdminUserDetailPage() {
  const { id } = useParams()
  const toast = useToast()
  useStore()
  const user = usersService.get(id)

  if (!user) return <EmptyState title="Utilisateur introuvable" />

  async function toggle() {
    try {
      await usersService.setStatus(user.id, user.status === 'active' ? 'inactive' : 'active')
      toast.success(user.status === 'active' ? 'Compte désactivé.' : 'Compte réactivé.')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <div className="flex items-center gap-4">
        <img src={user.avatar} alt="" className="h-20 w-20 rounded-full object-cover" />
        <div>
          <h1 className="font-display text-3xl font-bold">
            {user.firstName} {user.lastName}
          </h1>
          <Badge tone={user.status === 'active' ? 'active' : 'inactive'}>
            {user.status === 'active' ? 'Actif' : 'Désactivé'}
          </Badge>
        </div>
      </div>
      <p>{user.email}</p>
      <p>{user.phone}</p>
      <p className="text-sm text-zinc-400">Inscrit le {formatDate(user.createdAt)}</p>
      <p>
        {user.purchasedCount} vidéos achetées · {formatFcfa(user.spentAmount)} dépensés
      </p>
      {user.role !== 'ADMIN' ? (
        <Button type="button" variant={user.status === 'active' ? 'danger' : 'primary'} onClick={toggle}>
          {user.status === 'active' ? 'Désactiver le compte' : 'Réactiver le compte'}
        </Button>
      ) : (
        <p className="text-sm text-zinc-500">Un administrateur ne peut pas être désactivé ici.</p>
      )}
    </div>
  )
}
