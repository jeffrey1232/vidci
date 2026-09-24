import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { validateLogin } from '../../utils/validators.js'

export default function LoginPage() {
  const { login, loading } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})

  async function submit(e) {
    e.preventDefault()
    const next = validateLogin(form)
    setErrors(next)
    if (Object.keys(next).length) return
    try {
      const user = await login(form)
      toast.success('Connexion réussie.')
      const nextPath = params.get('next')
      if (user.role === 'ADMIN' && !nextPath) navigate('/admin')
      else navigate(nextPath || '/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-bold">Se connecter</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Démo admin : <code>admin@vidci.ci</code> / <code>Admin123!</code>
        <br />
        Démo user : <code>jean@vidci.ci</code> / <code>User123!</code>
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
      <div className="mt-4 flex justify-between text-sm text-zinc-400">
        <Link to="/mot-de-passe-oublie">Mot de passe oublié</Link>
        <Link to="/inscription">Créer un compte</Link>
      </div>
    </div>
  )
}
