import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function SplashScreen({ onComplete }) {
  const [showLogo, setShowLogo] = useState(false)
  const [fadeOut, setFadeOut] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    // Animation du logo
    const logoTimer = setTimeout(() => {
      setShowLogo(true)
    }, 300)

    // Fade out après 2.5 secondes
    const fadeTimer = setTimeout(() => {
      setFadeOut(true)
    }, 2500)

    // Appeler onComplete après l'animation
    const completeTimer = setTimeout(() => {
      onComplete()
    }, 3000)

    return () => {
      clearTimeout(logoTimer)
      clearTimeout(fadeTimer)
      clearTimeout(completeTimer)
    }
  }, [onComplete])

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 via-pink-50 to-rose-50 transition-opacity duration-700 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div
        className={`transform transition-all duration-1000 ${
          showLogo ? 'scale-100 opacity-100' : 'scale-50 opacity-0'
        }`}
      >
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 blur-3xl opacity-30 animate-pulse" />
          <h1 className="relative font-display text-6xl font-extrabold bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent md:text-8xl">
            VIDCI
          </h1>
        </div>
        <div className="mt-4 flex justify-center gap-2">
          <div className="h-2 w-2 rounded-full bg-purple-400 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="h-2 w-2 rounded-full bg-pink-400 animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="h-2 w-2 rounded-full bg-rose-400 animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}
