import { ArrowRight, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import CategoryCard from '../../components/category/CategoryCard.jsx'
import Button from '../../components/common/Button.jsx'
import VideoGrid from '../../components/video/VideoGrid.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { categoriesService } from '../../services/categories.js'

export default function HomePage() {
  const { videos, categories } = useStore()
  const cats = categoriesService.list()
  const published = videos.filter((v) => v.status === 'published')
  const featured = published.slice(0, 8)

  return (
    <div>
      <section className="relative overflow-hidden bg-grid">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-700/30 via-transparent to-amber-500/10" />
        <div className="relative mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div>
            <p className="mb-3 text-sm uppercase tracking-[0.2em] text-brand-300">Plateforme VIDCI</p>
            <h1 className="font-display text-4xl font-extrabold leading-tight md:text-6xl">
              Découvrez et achetez vos <span className="text-gradient">vidéos préférées</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg text-zinc-300">
              Les meilleures vidéos pour votre plaisir sont ici.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button as={Link} to="/videos" size="lg">
                Explorer les vidéos <ArrowRight size={18} />
              </Button>
              <Button as={Link} to="/categories" variant="outline" size="lg">
                Voir les catégories
              </Button>
            </div>
          </div>
        
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="font-display text-3xl font-bold">Catégories</h2>
            <p className="text-sm text-zinc-400">Provenant de l’espace administrateur</p>
          </div>
          <Link to="/categories" className="text-sm text-brand-300">
            Tout voir
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {cats.slice(0, 5).map((c) => (
            <CategoryCard key={c.id} category={c} />
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <h2 className="mb-6 font-display text-3xl font-bold">Vidéos à la une</h2>
        <VideoGrid videos={featured} categories={categories} />
      </section>
    </div>
  )
}
