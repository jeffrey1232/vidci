import { Link } from 'react-router-dom'

export default function CategoryCard({ category }) {
  return (
    <Link
      to={`/categories/${category.slug}`}
      className="group relative overflow-hidden rounded-2xl border border-white/10"
    >
      <img
        src={category.image}
        alt=""
        className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      <div className="absolute bottom-0 p-4">
        <h3 className="font-display text-lg font-semibold">{category.name}</h3>
        <p className="text-xs text-zinc-300">{category.videoCount || 0} vidéos</p>
      </div>
    </Link>
  )
}
