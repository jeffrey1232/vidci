import { createContext, useContext, useState } from 'react'

const PaymentModalContext = createContext(null)

export function PaymentModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    open: false,
    video: null,
    onPaymentSuccess: null,
  })

  const openPaymentModal = (video, onPaymentSuccess) => {
    setModalState({
      open: true,
      video,
      onPaymentSuccess,
    })
  }

  const closePaymentModal = () => {
    setModalState({
      open: false,
      video: null,
      onPaymentSuccess: null,
    })
  }

  return (
    <PaymentModalContext.Provider value={{ modalState, openPaymentModal, closePaymentModal }}>
      {children}
    </PaymentModalContext.Provider>
  )
}

export function usePaymentModal() {
  const context = useContext(PaymentModalContext)
  if (!context) {
    throw new Error('usePaymentModal must be used within PaymentModalProvider')
  }
  return context
}
