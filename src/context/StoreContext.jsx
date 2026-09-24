/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { getDb, subscribeStore } from '../services/mockStore.js'
import { statsService } from '../services/payments.js'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [version, setVersion] = useState(0)

  useEffect(() => subscribeStore(() => setVersion((n) => n + 1)), [])

  const value = useMemo(() => {
    const db = getDb()
    return {
      version,
      categories: db.categories,
      videos: db.videos,
      users: db.users,
      transactions: db.transactions,
      purchases: db.purchases,
      stats: statsService.dashboard(),
    }
  }, [version])

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
