import { useState } from 'react'
import { Link } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'
import Input from '../../components/common/Input.jsx'
import { useToast } from '../../context/ToastContext.jsx'
import { authService } from '../../services/auth.js'
import { isEmail } from '../../utils/validators.js'

export default function ForgotPasswordPage() {
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!isEmail(email)) {
      toast.error('Email invalide.')
      return
    }
    const result = await authService.forgotPassword(email)
    setSent(true)
    toast.success(result.message)
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="font-display text-3xl font-bold">Mot de passe oublié</h1>
      <p className="mt-2 text-sm text-zinc-400">
        Interface préparée pour l’envoi d’un email de réinitialisation. Simulation uniquement.
      </p>
      {sent ? (
        <p className="mt-6 rounded-xl border border-emerald-500/30 bg-emerald-950/50 p-4 text-sm">
          Consultez votre boîte mail (simulation). Aucun email réel n’a été envoyé.
        </p>
      ) : (
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <Button type="submit" className="w-full">
            Envoyer le lien
          </Button>
        </form>
      )}
      <Link to="/connexion" className="mt-4 inline-block text-sm text-zinc-400">
        Retour à la connexion
      </Link>
    </div>
  )
}
