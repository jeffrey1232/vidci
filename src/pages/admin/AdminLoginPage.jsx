import { useState } from 'react'
import { Link, Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { validateLogin } from '../../utils/validators.js'

export default function AdminLoginPage() {
  const { login, logout, loading, isAdmin } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  if (isAdmin) {
    return <Navigate to={params.get('next') || '/admin'} replace />
  }

  async function submit(e) {
    e.preventDefault()
    const next = validateLogin(form)
    setErrors(next)
    if (Object.keys(next).length) return
    try {
      const user = await login(form)
      if (user.role !== 'ADMIN') {
        logout()
        toast.error('Accès réservé aux administrateurs.')
        return
      }
      toast.success('Connexion administrateur réussie.')
      navigate(params.get('next') || '/admin')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-ink-950 px-4 text-zinc-100">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-ink-900 p-6">
        <Link to="/" className="font-display text-2xl font-bold">
          VIDCI
        </Link>
        <h1 className="mt-4 font-display text-3xl font-bold">Espace admin</h1>
        <p className="mt-2 text-sm text-zinc-400">
          Démo : <code>admin@vidci.ci</code> / <code>Admin123!</code>
        </p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            error={errors.email}
          />
          <Input
            label="Mot de passe"
            name="password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            error={errors.password}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            Connexion
          </Button>
        </form>
        <Link to="/" className="mt-4 inline-block text-sm text-zinc-400">
          Retour au site
        </Link>
      </div>
    </div>
  )
}
