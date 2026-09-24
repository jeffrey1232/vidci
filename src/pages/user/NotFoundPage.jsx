import { Link } from 'react-router-dom'
import Button from '../../components/common/Button.jsx'

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-24 text-center">
      <p className="text-sm uppercase tracking-widest text-brand-300">404</p>
      <h1 className="mt-2 font-display text-4xl font-bold">Page introuvable</h1>
      <Button as={Link} to="/" className="mt-8">
        Retour à l’accueil
      </Button>
    </div>
  )
}
