import { useMemo, useState } from 'react'
import CategoryPills from '../../components/category/CategoryPills.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import { Select } from '../../components/common/Input.jsx'
import VideoGrid from '../../components/video/VideoGrid.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { categoriesService } from '../../services/categories.js'

export default function VideosPage() {
  const { videos, categories } = useStore()
  const cats = categoriesService.list()
  const [type, setType] = useState('all')
  const [sort, setSort] = useState('recent')
  const [maxPrice, setMaxPrice] = useState('')
  const [categoryId, setCategoryId] = useState('all')

  const filtered = useMemo(() => {
    let list = videos.filter((v) => v.status === 'published')
    if (categoryId !== 'all') list = list.filter((v) => v.categoryId === categoryId)
    if (type !== 'all') list = list.filter((v) => v.type === type)
    if (maxPrice !== '') list = list.filter((v) => v.type === 'free' || v.price <= Number(maxPrice))
    if (sort === 'recent') list = [...list].sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
    if (sort === 'popular') list = [...list].sort((a, b) => b.salesCount + b.views - (a.salesCount + a.views))
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price)
    return list
  }, [videos, type, sort, maxPrice, categoryId])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold">Catalogue</h1>
      <p className="mt-2 text-zinc-400">Filtrez par catégorie, prix ou popularité.</p>
      <div className="mt-6">
        <CategoryPills categories={cats} selected="all" />
      </div>
      <div className="mt-6 grid gap-3 md:grid-cols-4">
        <Select label="Catégorie" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="all">Toutes</option>
          {cats.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        <Select label="Gratuit / Payant" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="all">Tous</option>
          <option value="free">Gratuit</option>
          <option value="paid">Payant</option>
        </Select>
        <Select label="Prix max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)}>
          <option value="">Aucun plafond</option>
          <option value="2000">2 000 FCFA</option>
          <option value="5000">5 000 FCFA</option>
          <option value="8000">8 000 FCFA</option>
        </Select>
        <Select label="Tri" value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="recent">Plus récent</option>
          <option value="popular">Popularité</option>
          <option value="price-asc">Prix croissant</option>
          <option value="price-desc">Prix décroissant</option>
        </Select>
      </div>
      <div className="mt-8">
        {filtered.length ? (
          <VideoGrid videos={filtered} categories={categories} />
        ) : (
          <EmptyState title="Aucune vidéo ne correspond aux filtres" />
        )}
      </div>
    </div>
  )
}
