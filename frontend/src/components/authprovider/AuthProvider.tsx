import { createContext, useContext, useEffect, useState } from "react";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../../constants";
import { ReactNode } from "react";
import { AuthContextType } from './AuthProvider.d'

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

const checkTokens = (): boolean => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN)
  const refreshToken = localStorage.getItem(REFRESH_TOKEN)
  return !!(accessToken && refreshToken)
}

export const AuthProvider = ({ children }: { children: ReactNode }): ReactNode => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkLoginStatus = () => {
    const isLoggedIn = checkTokens()
    setLoggedIn(isLoggedIn)
    setLoading(false)
  }

  useEffect(() => {
    checkLoginStatus()
  }, [])

  const login = () => {
    setLoggedIn(true)
  }

  const logout = () => {
    localStorage.clear()
    setLoggedIn(false)
  }

  const value: AuthContextType = {
    loggedIn,
    loading,
    login,
    logout,
    checkLoginStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
