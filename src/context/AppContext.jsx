import { useEffect, useMemo, useState } from 'react'
import { AppContext } from './appContext.js'

export function AppProvider({ children }) {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [theme, setTheme] = useState('dark')

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const value = useMemo(
    () => ({
      isSidebarCollapsed,
      setSidebarCollapsed,
      theme,
      toggleTheme: () => setTheme((current) => (current === 'dark' ? 'light' : 'dark')),
    }),
    [isSidebarCollapsed, theme],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
