/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useState } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [item, setItem] = useState(null)

  const value = useMemo(
    () => ({
      item,
      setCheckoutVideo(video) {
        setItem(video)
      },
      clear() {
        setItem(null)
      },
    }),
    [item],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
