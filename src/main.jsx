import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { PaymentModalProvider } from './context/PaymentModalContext.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PaymentModalProvider>
      <App />
    </PaymentModalProvider>
  </StrictMode>,
)
