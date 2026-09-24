import { Link, useParams } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { categoriesService } from '../../services/categories.js'
import { formatDate } from '../../utils/format.js'

export default function AdminCategoryDetailPage() {
  const { id } = useParams()
  const category = categoriesService.get(id)
  if (!category) return <EmptyState title="Catégorie introuvable" />

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      <img src={category.image} alt="" className="h-56 w-full rounded-2xl object-cover" />
      <h1 className="font-display text-3xl font-bold">{category.name}</h1>
      <p className="text-zinc-300">{category.description}</p>
      <p className="text-sm text-zinc-400">
        {category.videoCount} vidéos · créée le {formatDate(category.createdAt)}
      </p>
      <Button as={Link} to={`/admin/categories/${category.id}/modifier`}>
        Modifier
      </Button>
    </div>
  )
}
