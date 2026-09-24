import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import { ToastProvider } from './context/ToastContext.jsx'
import { usePaymentModal } from './context/PaymentModalContext.jsx'
import WavePaymentModal from './components/common/WavePaymentModal.jsx'
import SplashScreen from './components/common/SplashScreen.jsx'
import AgeVerificationModal from './components/common/AgeVerificationModal.jsx'
import AppRoutes from './routes/AppRoutes.jsx'

function GlobalPaymentModal() {
  const { modalState, closePaymentModal } = usePaymentModal()
  return (
    <WavePaymentModal
      open={modalState.open}
      onClose={closePaymentModal}
      video={modalState.video}
      onPaymentSuccess={modalState.onPaymentSuccess}
    />
  )
}

export default function App() {
  const [showSplash, setShowSplash] = useState(true)
  const [showAgeVerification, setShowAgeVerification] = useState(false)

  const handleSplashComplete = () => {
    setShowSplash(false)
    const ageVerified = localStorage.getItem('ageVerified')
    if (!ageVerified) {
      setShowAgeVerification(true)
    }
  }

  const handleAgeVerification = () => {
    setShowAgeVerification(false)
    localStorage.setItem('ageVerified', 'true')
  }

  return (
    <BrowserRouter>
      <ToastProvider>
        <StoreProvider>
          <AuthProvider>
            <CartProvider>
              <SplashScreen onComplete={handleSplashComplete} />
              {showAgeVerification && <AgeVerificationModal onConfirm={handleAgeVerification} />}
              <AppRoutes />
              <GlobalPaymentModal />
            </CartProvider>
          </AuthProvider>
        </StoreProvider>
      </ToastProvider>
    </BrowserRouter>
  )
}
