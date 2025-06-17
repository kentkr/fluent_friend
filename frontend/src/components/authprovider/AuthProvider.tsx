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

  const login = async (username: string, password: string) => {
    let res = await loginOrRegister("/api/token/", { username, password })
    setLoggedIn(res)
  }

  const logout = () => {
    localStorage.clear()
    setLoggedIn(false)
  }

  const register = (username: string, password: string) => {
    loginOrRegister('/api/user/register/', { username, password })
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
