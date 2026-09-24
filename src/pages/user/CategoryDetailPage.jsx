import { useMemo } from 'react'
import { useParams } from 'react-router-dom'
import CategoryPills from '../../components/category/CategoryPills.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import VideoGrid from '../../components/video/VideoGrid.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { categoriesService } from '../../services/categories.js'

export default function CategoryDetailPage() {
  const { slug } = useParams()
  const { videos, categories } = useStore()
  const category = categoriesService.get(slug)
  const cats = categoriesService.list()

  const filtered = useMemo(() => {
    if (!category) return []
    return videos.filter((v) => v.status === 'published' && v.categoryId === category.id)
  }, [videos, category])

  if (!category) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10">
        <EmptyState title="Catégorie introuvable" />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <CategoryPills categories={cats} selected={category.slug} />
      <div className="mt-8 overflow-hidden rounded-3xl">
        <img src={category.image} alt="" className="h-48 w-full object-cover" />
      </div>
      <h1 className="mt-6 font-display text-4xl font-bold">{category.name}</h1>
      <p className="mt-2 max-w-2xl text-zinc-400">{category.description}</p>
      <div className="mt-8">
        {filtered.length ? (
          <VideoGrid videos={filtered} categories={categories} />
        ) : (
          <EmptyState title="Aucune vidéo dans cette catégorie" />
        )}
      </div>
    </div>
  )
}
