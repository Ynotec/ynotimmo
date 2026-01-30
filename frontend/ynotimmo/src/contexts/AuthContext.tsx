import { createContext, useContext, useState } from 'react'
import type { ReactNode } from 'react'
import AuthService from '../services/AuthService'
import type { IAuth } from '../types/IAuth'

interface AuthContextType {
  user: any | null
  login: (authData: IAuth) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any | null>(null)

  const login = async (authData: IAuth) => {
    try {
      const response = await AuthService.login(authData)
      setUser(response)
    } catch (error) {
      console.error('Login failed', error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
