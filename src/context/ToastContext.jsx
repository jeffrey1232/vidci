/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const api = useMemo(() => {
    const push = (message, type = 'success') => {
      const id = `${Date.now()}-${Math.random()}`
      setToasts((current) => [...current, { id, message, type }])
      setTimeout(() => {
        setToasts((current) => current.filter((t) => t.id !== id))
      }, 3200)
    }
    return {
      push,
      success: (message) => push(message, 'success'),
      error: (message) => push(message, 'error'),
    }
  }, [])

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="pointer-events-none fixed right-4 top-4 z-[80] flex w-[min(92vw,360px)] flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`pointer-events-auto rounded-xl border px-4 py-3 text-sm shadow-lg backdrop-blur ${
              toast.type === 'error'
                ? 'border-rose-500/30 bg-rose-950/90 text-rose-100'
                : 'border-emerald-500/30 bg-emerald-950/90 text-emerald-100'
            }`}
          >
            {toast.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
