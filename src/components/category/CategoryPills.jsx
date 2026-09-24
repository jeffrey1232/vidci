import { NavLink } from 'react-router-dom'
import { cn } from '../../utils/format.js'

export default function CategoryPills({ categories, selected = 'all' }) {
  const items = [{ id: 'all', slug: 'all', name: 'Toutes' }, ...categories]

  return (
    <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
      {items.map((item) => (
        <NavLink
          key={item.id}
          to={item.slug === 'all' ? '/videos' : `/categories/${item.slug}`}
          className={() =>
            cn(
              'shrink-0 rounded-full border px-4 py-2 text-sm transition',
              (selected === 'all' && item.slug === 'all') || selected === item.slug
                ? 'border-brand-400 bg-brand-500 text-white'
                : 'border-white/10 bg-white/5 text-zinc-300 hover:border-white/20',
            )
          }
        >
          {item.name}
        </NavLink>
      ))}
    </div>
  )
}
