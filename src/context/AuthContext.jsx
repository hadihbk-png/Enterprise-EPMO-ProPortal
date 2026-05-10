import { useEffect, useMemo, useState } from 'react'
import { supabase } from '../services/supabase.js'
import { AuthContext } from './authContext.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isAuthLoading, setAuthLoading] = useState(Boolean(supabase))

  useEffect(() => {
    if (!supabase) return undefined
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null)
      setAuthLoading(false)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthLoading,
      signIn: async (email, password) => {
        if (!supabase) throw new Error('Supabase is not configured.')
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
      },
      signUp: async (email, password) => {
        if (!supabase) throw new Error('Supabase is not configured.')
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
      },
      signOut: async () => {
        if (!supabase) return
        await supabase.auth.signOut()
      },
    }),
    [isAuthLoading, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
