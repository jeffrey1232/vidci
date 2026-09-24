import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import { useAuth } from '../../context/AuthContext.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { validateRegister } from '../../utils/validators.js'

export default function RegisterPage() {
  const { register, loading } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState({
    lastName: '',
    firstName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [errors, setErrors] = useState({})

  function change(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  async function submit(e) {
    e.preventDefault()
    const next = validateRegister(form)
    setErrors(next)
    if (Object.keys(next).length) return
    try {
      await register(form)
      toast.success('Compte créé.')
      navigate('/')
    } catch (error) {
      toast.error(error.message)
    }
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-bold">Créer un compte</h1>
      <form onSubmit={submit} className="mt-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nom" name="lastName" value={form.lastName} onChange={change} error={errors.lastName} />
          <Input label="Prénom" name="firstName" value={form.firstName} onChange={change} error={errors.firstName} />
        </div>
        <Input label="Email" name="email" type="email" value={form.email} onChange={change} error={errors.email} />
        <Input label="Téléphone" name="phone" value={form.phone} onChange={change} error={errors.phone} />
        <Input
          label="Mot de passe"
          name="password"
          type="password"
          value={form.password}
          onChange={change}
          error={errors.password}
        />
        <Input
          label="Confirmation"
          name="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={change}
          error={errors.confirmPassword}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          S’inscrire
        </Button>
      </form>
      <p className="mt-4 text-sm text-zinc-400">
        Déjà un compte ? <Link to="/connexion">Se connecter</Link>
      </p>
    </div>
  )
}
