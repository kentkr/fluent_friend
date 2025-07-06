import '../styles/theme.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Login from "./pages/login/Login"
import Register from "./pages/register/Register"
import Home from "./pages/home/Home"
import NotFound from "./pages/notfound/NotFound"
import ProtectedRoute from "../components/ProtectedRoute"
import Header from "../components/header/Header"
import Journal from "./pages/journal/Journal"
import Chat from './pages/chat/Chat'
import { AuthProvider, useAuth } from '../components/authprovider/AuthProvider'
import { useEffect } from 'react'

function Logout() {
  const { logout } = useAuth()
  useEffect(() => {
    logout()
  }, [logout])

  return <Navigate to="/login" replace />
}

function RegisterAndLogout() {
  const { logout } = useAuth()
  
  useEffect(() => {
    logout()
  }, [logout])

  return <Register />
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route
            path="/"
            element={
              <Home />
            }
            />
          <Route path="/login" element={<Login />} />
          <Route path="/logout" element={<Logout />} />
          <Route path="/register" element={<RegisterAndLogout />} />
          <Route path="/chat" element={<Chat />} />
          <Route
            path="/journal"
            element={
              <ProtectedRoute>
                <Journal />
              </ProtectedRoute>
            }
            />
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
