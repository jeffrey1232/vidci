import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function AgeVerificationModal({ onConfirm }) {
  const navigate = useNavigate()

  const handleOver18 = () => {
    onConfirm()
    navigate('/')
  }

  const handleUnder18 = () => {
    onConfirm()
    navigate('/')
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="mx-4 max-w-md rounded-3xl border-2 border-purple-200 bg-white/95 p-8 shadow-2xl shadow-purple-200/50">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-r from-purple-400 to-pink-400">
            <span className="text-2xl font-bold text-white">18+</span>
          </div>
          <h2 className="font-display text-2xl font-bold text-ink-900">Vérification d'âge</h2>
          <p className="mt-3 text-sm text-ink-600">
            Veuillez confirmer que vous avez l'âge légal pour accéder à ce contenu.
          </p>
        </div>

        <div className="space-y-3">
          <button
            onClick={handleOver18}
            className="w-full rounded-2xl bg-gradient-to-r from-purple-400 to-pink-400 py-3 text-base font-semibold text-white transition hover:from-purple-300 hover:to-pink-300 shadow-lg shadow-purple-400/20"
          >
            J'ai plus de 18 ans
          </button>
          <button
            onClick={handleUnder18}
            className="w-full rounded-2xl border-2 border-purple-200 bg-white py-3 text-base font-semibold text-ink-700 transition hover:border-purple-400 hover:bg-purple-50"
          >
            J'ai moins de 18 ans
          </button>
        </div>

        <p className="mt-4 text-center text-xs text-ink-500">
          En continuant, vous acceptez nos conditions d'utilisation.
        </p>
      </div>
    </div>
  )
}
