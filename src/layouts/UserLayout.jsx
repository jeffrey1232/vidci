import { Menu, Search, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import Button from '../components/common/Button.jsx'
import { useStore } from '../context/StoreContext.jsx'

const links = [
  { to: '/', label: 'Accueil' },
  { to: '/categories', label: 'Catégories' },
  { to: '/videos', label: 'Vidéos' },
]

export default function UserLayout() {
  const { videos, categories } = useStore()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [focused, setFocused] = useState(false)
  const navigate = useNavigate()

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return { videos: [], categories: [] }
    return {
      videos: videos
        .filter((v) => v.status === 'published')
        .filter((v) => `${v.title} ${v.description}`.toLowerCase().includes(q))
        .slice(0, 5),
      categories: categories.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 4),
    }
  }, [query, videos, categories])

  function submitSearch(e) {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    setFocused(false)
    navigate(`/recherche?q=${encodeURIComponent(q)}`)
  }

  return (
    <div className="min-h-svh bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 text-ink-900">
      <header className="sticky top-0 z-40 border-b border-purple-200 bg-white/80 backdrop-blur-xl shadow-sm shadow-purple-200/30">
        <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
          <Link to="/" className="font-display text-2xl font-extrabold tracking-tight bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            VIDCI
          </Link>
          <nav className="hidden items-center gap-6 lg:flex">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm font-medium transition ${isActive ? 'text-purple-600 font-semibold' : 'text-ink-600 hover:text-purple-500'}`
                }
                end={link.to === '/'}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <form onSubmit={submitSearch} className="relative ml-auto hidden min-w-[220px] flex-1 max-w-md md:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-purple-400" size={16} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="Rechercher une vidéo..."
              className="h-10 w-full rounded-full border-2 border-purple-200 bg-white/90 pl-9 pr-4 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-200 text-ink-900 placeholder:text-purple-300"
            />
            {focused && query.trim() ? (
              <div className="absolute top-12 w-full overflow-hidden rounded-2xl border-2 border-purple-200 bg-white shadow-xl shadow-purple-200/30">
                {results.categories.map((c) => (
                  <Link
                    key={c.id}
                    to={`/categories/${c.slug}`}
                    className="block px-3 py-2 text-sm text-ink-700 hover:bg-purple-50 transition"
                  >
                    Catégorie · {c.name}
                  </Link>
                ))}
                {results.videos.map((v) => (
                  <Link key={v.id} to={`/videos/${v.id}`} className="block px-3 py-2 text-sm text-ink-700 hover:bg-purple-50 transition">
                    {v.title}
                  </Link>
                ))}
                {!results.videos.length && !results.categories.length ? (
                  <p className="px-3 py-3 text-sm text-purple-400">Aucun résultat</p>
                ) : null}
              </div>
            ) : null}
          </form>
          
          <button type="button" className="ml-auto rounded-full p-2 text-ink-700 hover:bg-purple-100 transition lg:hidden" onClick={() => setOpen(true)}>
            <Menu />
          </button>
        </div>
      </header>

      {open ? (
        <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-50 to-pink-100 p-5 lg:hidden">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-display text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">VIDCI</span>
            <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-ink-700 hover:bg-purple-200 transition">
              <X />
            </button>
          </div>
          <form
            onSubmit={(e) => {
              submitSearch(e)
              setOpen(false)
            }}
            className="mb-6"
          >
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher une vidéo..."
              className="h-11 w-full rounded-2xl border-2 border-purple-200 bg-white/90 px-4 text-ink-900 placeholder:text-purple-300 focus:border-purple-400 focus:ring-2 focus:ring-purple-200 outline-none"
            />
          </form>
          <div className="flex flex-col gap-4 text-lg font-medium text-ink-700">
            {links.map((link) => (
              <Link key={link.to} to={link.to} onClick={() => setOpen(false)} className="hover:text-purple-600 transition">
                {link.label}
              </Link>
            ))}
            <Link to="/admin" onClick={() => setOpen(false)} className="hover:text-purple-600 transition">
              Admin
            </Link>
          </div>
        </div>
      ) : null}

      <main>
        <Outlet />
      </main>
      <footer className="mt-16 border-t border-purple-200 bg-white/50 py-10 text-center text-sm text-ink-600">
        © {new Date().getFullYear()} VIDCI — Plateforme de vidéos à la demande
      </footer>
    </div>
  )
}
