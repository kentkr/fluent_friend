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

function Logout() {
  localStorage.clear()
  return <Navigate to="/login" />
}

function RegisterAndLogout() {
  localStorage.clear()
  return <Register />
}

function App() {
  return (
    <>
      <Header/>
      <BrowserRouter>
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
    </>
  )
}

export default App
