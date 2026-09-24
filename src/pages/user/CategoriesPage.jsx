import CategoryCard from '../../components/category/CategoryCard.jsx'
import { useStore } from '../../context/StoreContext.jsx'
import { categoriesService } from '../../services/categories.js'

export default function CategoriesPage() {
  useStore()
  const categories = categoriesService.list()
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-display text-4xl font-bold">Catégories</h1>
      <p className="mt-2 text-zinc-400">Parcourez les univers créés par l’équipe VIDCI.</p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((c) => (
          <CategoryCard key={c.id} category={c} />
        ))}
      </div>
    </div>
  )
}
