import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Badge from '../../components/common/Badge.jsx'
import Button from '../../components/common/Button.jsx'
import Modal from '../../components/common/Modal.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { videosService } from '../../services/videos.js'
import { formatFcfa } from '../../utils/format.js'

export default function AdminVideosPage() {
  const { videos, categories } = useStore()
  const toast = useToast()
  const [toDelete, setToDelete] = useState(null)
  const names = Object.fromEntries(categories.map((c) => [c.id, c.name]))

  async function confirmDelete() {
    await videosService.remove(toDelete.id)
    toast.success('Vidéo supprimée.')
    setToDelete(null)
  }

  async function toggle(video) {
    await videosService.toggleStatus(video.id)
    toast.success(video.status === 'published' ? 'Vidéo dépubliée.' : 'Vidéo publiée.')
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Gestion des vidéos</h1>
        <Button as={Link} to="/admin/videos/nouveau">
          <Plus size={16} /> Ajouter une vidéo
        </Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[860px] text-left text-sm">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="p-3">Titre</th>
              <th>Catégorie</th>
              <th>Prix</th>
              <th>Statut</th>
              <th>Ventes</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {videos.map((video) => (
              <tr key={video.id} className="border-t border-white/10">
                <td className="p-3">{video.title}</td>
                <td>{names[video.categoryId]}</td>
                <td>
                  {video.type === 'paid' ? formatFcfa(video.price) : (
                    <Badge tone="free">Gratuit</Badge>
                  )}
                </td>
                <td>
                  <Badge tone={video.status === 'published' ? 'published' : 'draft'}>
                    {video.status === 'published' ? 'Publiée' : 'Brouillon'}
                  </Badge>
                </td>
                <td>{video.salesCount}</td>
                <td className="space-x-2 whitespace-nowrap p-3">
                  <Link to={`/admin/videos/${video.id}`} className="inline-flex text-zinc-300">
                    <Eye size={16} />
                  </Link>
                  <Link to={`/admin/videos/${video.id}/modifier`} className="inline-flex text-zinc-300">
                    <Pencil size={16} />
                  </Link>
                  <button type="button" onClick={() => toggle(video)} className="text-brand-300">
                    {video.status === 'published' ? 'Dépublier' : 'Publier'}
                  </button>
                  <button type="button" onClick={() => setToDelete(video)} className="text-rose-400">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Modal
        open={Boolean(toDelete)}
        title="Supprimer cette vidéo ?"
        onClose={() => setToDelete(null)}
        footer={
          <>
            <Button variant="ghost" type="button" onClick={() => setToDelete(null)}>
              Annuler
            </Button>
            <Button variant="danger" type="button" onClick={confirmDelete}>
              Supprimer
            </Button>
          </>
        }
      >
        <p className="text-sm text-zinc-300">Cette action est irréversible dans la démo locale.</p>
      </Modal>
    </div>
  )
}
