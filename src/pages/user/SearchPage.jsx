import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import CategoryCard from '../../components/category/CategoryCard.jsx'
import EmptyState from '../../components/common/EmptyState.jsx'
import VideoGrid from '../../components/video/VideoGrid.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { categoriesService } from '../../services/categories.js'

export default function SearchPage() {
  const [params] = useSearchParams()
  const q = (params.get('q') || '').trim().toLowerCase()
  const { videos, categories } = useStore()
  const cats = categoriesService.list()

  const result = useMemo(() => {
    if (!q) return { videos: [], categories: [] }
    return {
      videos: videos.filter(
        (v) => v.status === 'published' && `${v.title} ${v.description} ${v.author}`.toLowerCase().includes(q),
      ),
      categories: cats.filter((c) => `${c.name} ${c.description}`.toLowerCase().includes(q)),
    }
  }, [q, videos, cats])

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold">Recherche</h1>
      <p className="mt-2 text-zinc-400">
        Résultats pour « {params.get('q') || ''} »
      </p>
      {!q ? (
        <div className="mt-8">
          <EmptyState title="Saisissez un mot-clé" description="Recherchez une vidéo ou une catégorie." />
        </div>
      ) : (
        <>
          {result.categories.length ? (
            <section className="mt-8">
              <h2 className="mb-4 font-display text-2xl font-semibold">Catégories</h2>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {result.categories.map((c) => (
                  <CategoryCard key={c.id} category={c} />
                ))}
              </div>
            </section>
          ) : null}
          <section className="mt-10">
            <h2 className="mb-4 font-display text-2xl font-semibold">Vidéos</h2>
            {result.videos.length ? (
              <VideoGrid videos={result.videos} categories={categories} />
            ) : (
              <EmptyState title="Aucune vidéo trouvée" />
            )}
          </section>
        </>
      )}
    </div>
  )
}
