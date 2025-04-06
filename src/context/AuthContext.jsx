"use client"

import { createContext, useState, useEffect } from "react"
import { login, register, logout, getCurrentUser } from "../services/auth"

export const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (token) {
          const userData = await getCurrentUser()
          setUser(userData)
          setIsAuthenticated(true)
        }
      } catch (err) {
        console.error("Authentication error:", err)
        localStorage.removeItem("token")
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const handleLogin = async (credentials) => {
    setLoading(true)
    setError(null)
    try {
      const { user, token } = await login(credentials)
      localStorage.setItem("token", token)
      setUser(user)
      setIsAuthenticated(true)
      return true
    } catch (err) {
      setError(err.message || "Login failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (userData) => {
    setLoading(true)
    setError(null)
    try {
      const { user, token } = await register(userData)
      localStorage.setItem("token", token)
      setUser(user)
      setIsAuthenticated(true)
      return true
    } catch (err) {
      setError(err.message || "Registration failed")
      return false
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    localStorage.removeItem("token")
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

