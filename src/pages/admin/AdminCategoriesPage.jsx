import { Eye, Pencil, Plus, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import Modal from '../../components/common/Modal.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { categoriesService } from '../../services/categories.js'
import { formatDate } from '../../utils/format.js'

export default function AdminCategoriesPage() {
  useStore()
  const categories = categoriesService.list()
  const toast = useToast()
  const [toDelete, setToDelete] = useState(null)

  async function confirmDelete() {
    try {
      await categoriesService.remove(toDelete.id)
      toast.success('Catégorie supprimée.')
      setToDelete(null)
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="font-display text-3xl font-bold">Catégories</h1>
        <Button as={Link} to="/admin/categories/nouveau">
          <Plus size={16} /> Nouvelle catégorie
        </Button>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full min-w-[800px] text-left text-sm">
          <thead className="bg-white/5 text-zinc-400">
            <tr>
              <th className="p-3">Nom</th>
              <th>Description</th>
              <th>Vidéos</th>
              <th>Création</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-white/10">
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <img src={c.image} alt="" className="h-10 w-14 rounded object-cover" />
                    {c.name}
                  </div>
                </td>
                <td className="max-w-sm truncate text-zinc-400">{c.description}</td>
                <td>{c.videoCount}</td>
                <td>{formatDate(c.createdAt)}</td>
                <td className="space-x-3 p-3">
                  <Link to={`/admin/categories/${c.id}`}>
                    <Eye size={16} />
                  </Link>
                  <Link to={`/admin/categories/${c.id}/modifier`}>
                    <Pencil size={16} />
                  </Link>
                  <button type="button" className="text-rose-400" onClick={() => setToDelete(c)}>
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
        title="Supprimer cette catégorie ?"
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
        <p className="text-sm text-zinc-300">
          Les vidéos rattachées resteront en catalogue, sans cette catégorie.
        </p>
      </Modal>
    </div>
  )
}
