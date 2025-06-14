import { createContext, useContext, useEffect, useState } from "react";
import {ACCESS_TOKEN, REFRESH_TOKEN} from "../../constants";
import { ReactNode } from "react";
import { AuthContextType } from './AuthProvider.d'
import { loginOrRegister } from "../../api/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// TODO: this doesnt feel sufficient - we should check if the refresh token needs to be refreshed
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

  const login = async (username: string, password: string) => {
    let userTokens = await loginOrRegister("/api/token/", { username, password })
    localStorage.setItem(ACCESS_TOKEN, userTokens.access);
    localStorage.setItem(REFRESH_TOKEN, userTokens.refresh);
    setLoggedIn(true)
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
