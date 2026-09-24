import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Modal from './Modal.jsx'
import Button from './Button.jsx'
import { formatFcfa } from '../../utils/format.js'
import waveLogo from '../../assets/wave.png'

export default function WavePaymentModal({ open, onClose, video, onPaymentSuccess }) {
  const navigate = useNavigate()
  const [phoneNumber, setPhoneNumber] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)
  const [step, setStep] = useState(1) // 1: entrer numéro, 2: confirmation, 3: succès

  if (!video) return null

  const handlePayment = async (e) => {
    e.preventDefault()
    if (!phoneNumber) return

    // Ouvrir le lien de paiement WAVE
    const wavePaymentUrl = 'https://pay.wave.com/m/M_ci_wUnRvgBHEaen/c/ci/'
    window.open(wavePaymentUrl, '_blank')
    
    setIsProcessing(true)
    setStep(2)

    // Simulation du processus de paiement WAVE
    setTimeout(() => {
      setIsProcessing(false)
      setStep(3)
      // Simuler le succès du paiement
      setTimeout(() => {
        onPaymentSuccess?.()
        onClose()
        setStep(1)
        setPhoneNumber('')
        // Rediriger vers la vidéo après paiement réussi
        navigate(`/watch/${video.id}`)
      }, 2000)
    }, 3000)
  }

  return (
    <Modal
      open={open}
      title="Paiement WAVE"
      onClose={onClose}
      footer={
        step === 1 ? (
          <Button type="button" onClick={handlePayment} disabled={!phoneNumber || isProcessing}>
            {isProcessing ? 'Traitement...' : 'Payer'}
          </Button>
        ) : null
      }
    >
      {step === 1 && (
        <div className="space-y-4">
          <div className="rounded-xl bg-blue-500/10 p-4 border border-blue-500/30">
            <div className="flex items-center gap-3">
              <img 
                src={waveLogo} 
                alt="WAVE" 
                className="h-12 w-12 rounded-full object-contain bg-white"
              />
              <div>
                <p className="font-semibold text-white">Paiement via WAVE</p>
                <p className="text-sm text-zinc-400">Payez facilement avec votre compte WAVE</p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-sm text-zinc-400">Vous allez payer :</p>
            <p className="text-2xl font-bold text-brand-300">{formatFcfa(video.price)}</p>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-zinc-300">
              Numéro de téléphone WAVE
            </label>
            <input
              type="tel"
              placeholder="Ex: 07 00 00 00 00"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-zinc-500 focus:border-brand-400 focus:outline-none"
            />
          </div>

          <p className="text-xs text-zinc-500">
            Cliquez sur "Payer" pour ouvrir le lien WAVE. Entrez le montant {formatFcfa(video.price)} manuellement et effectuez le paiement.
          </p>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col items-center space-y-4 py-8">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-brand-400 border-t-transparent" />
          <p className="text-lg font-medium text-white">Traitement du paiement en cours...</p>
          <p className="text-sm text-zinc-400">Veuillez confirmer le paiement sur votre application WAVE</p>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col items-center space-y-4 py-8">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500">
            <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-lg font-medium text-white">Paiement réussi !</p>
          <p className="text-sm text-zinc-400">Vous pouvez maintenant regarder la vidéo</p>
        </div>
      )}
    </Modal>
  )
}
