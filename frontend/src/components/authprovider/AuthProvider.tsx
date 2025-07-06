import { createContext, useContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { AuthContextType } from './AuthProvider.d'
import { isLoggedIn, loginOrRegister } from "../../api/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }): ReactNode => {
  const [loggedIn, setLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  const checkLoginStatus = async () => {
    const _isLoggedIn = await isLoggedIn()
    setLoggedIn(_isLoggedIn)
    setLoading(false)
  }

  useEffect(() => {
    checkLoginStatus()
  }, [])

  const login = async (email: string, password: string) => {
    let res = await loginOrRegister("/api/token/", { email, password })
    setLoggedIn(res)
  }

  const logout = () => {
    localStorage.clear()
    setLoggedIn(false)
  }

  const register = (email: string, password: string) => {
    loginOrRegister('/api/user/register/', { email, password })
  }

  const value: AuthContextType = {
    loggedIn,
    loading,
    login,
    logout,
    checkLoginStatus,
    register,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
