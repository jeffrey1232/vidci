import {
  Clapperboard,
  FolderTree,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  Users,
  X,
} from 'lucide-react'
import { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { cn } from '../utils/format.js'

const links = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/videos', label: 'Vidéos', icon: Clapperboard },
  { to: '/admin/categories', label: 'Catégories', icon: FolderTree },
  { to: '/admin/users', label: 'Utilisateurs', icon: Users },
  { to: '/admin/transactions', label: 'Transactions', icon: Receipt },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()

  const nav = (
    <nav className="space-y-1">
      {links.map((link) => (
        <NavLink
          key={link.to}
          to={link.to}
          end={link.end}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            cn(
              'flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition',
              isActive ? 'bg-gradient-to-r from-purple-400 to-pink-400 text-white shadow-lg shadow-purple-400/20' : 'text-ink-700 hover:bg-purple-100',
            )
          }
        >
          <link.icon size={18} />
          {link.label}
        </NavLink>
      ))}
    </nav>
  )

  return (
    <div className="min-h-svh bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 text-ink-900 lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="hidden border-r border-purple-200 bg-white/80 backdrop-blur-sm p-5 lg:block shadow-lg shadow-purple-200/30">
        <Link to="/admin" className="font-display text-2xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          VIDCI Admin
        </Link>
        <div className="mt-8">{nav}</div>
        <Link to="/" className="mt-10 block text-sm text-ink-600 hover:text-purple-600 transition font-medium">
          ← Retour au site
        </Link>
      </aside>
      <div>
        <header className="flex items-center justify-between border-b border-purple-200 bg-white/80 backdrop-blur-sm px-4 py-3 shadow-sm">
          <button type="button" className="lg:hidden text-ink-700 hover:bg-purple-100 rounded-full p-2 transition" onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <p className="text-sm text-ink-700 font-medium">
            {user?.firstName} {user?.lastName}
          </p>
          <button
            type="button"
            className="inline-flex items-center gap-2 text-sm text-ink-700 hover:text-purple-600 transition font-medium"
            onClick={() => {
              logout()
              navigate('/admin/login')
            }}
          >
            <LogOut size={16} /> Déconnexion
          </button>
        </header>
        {open ? (
          <div className="fixed inset-0 z-50 bg-gradient-to-br from-purple-50 to-pink-100 p-5 lg:hidden">
            <div className="mb-6 flex justify-between">
              <span className="font-display text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">VIDCI Admin</span>
              <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 text-ink-700 hover:bg-purple-200 transition">
                <X />
              </button>
            </div>
            {nav}
          </div>
        ) : null}
        <div className="p-4 md:p-6">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
