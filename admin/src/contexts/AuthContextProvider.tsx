import { ReactNode, useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'

export interface AuthContextType {
  // auth is the token
  auth: string | null
  setAuth: (auth: string | null) => void
  authLoaded: boolean
}

export const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [authLoaded, setAuthLoaded] = useState(false)

  const [auth, setAuth] = useState<string | null>(null)

  useEffect(() => {
    const localAuth = localStorage.getItem('ncsuguessr-auth')
    setAuth(localAuth ? JSON.parse(localAuth) : localAuth)
    setAuthLoaded(true)
  }, [])

  useEffect(() => {
    if (authLoaded) {
      setAuthLoaded(false)
      if (auth) {
        localStorage.setItem('ncsuguessr-auth', JSON.stringify(auth))
      } else {
        localStorage.removeItem('ncsuguessr-auth')
      }
      setAuthLoaded(true)
    }
  }, [auth, authLoaded])

  return (
    <AuthContext.Provider value={{ auth, setAuth, authLoaded }}>
      {children}
    </AuthContext.Provider>
  )
}
