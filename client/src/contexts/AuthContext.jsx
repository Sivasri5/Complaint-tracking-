"use client"

import { createContext, useContext, useState, useEffect } from "react"
import api from "../services/api"
import { useNavigate } from "react-router-dom"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  // Check if user is already logged in
  useEffect(() => {
    const checkLoggedIn = async () => {
      const token = localStorage.getItem("token")
      if (token) {
        try {
          // Verify token and get user data
          const response = await api.get("/api/auth/verify")
          setUser(response.data)
        } catch (err) {
          console.error("Token verification failed:", err)
          localStorage.removeItem("token")
        }
      }
      setLoading(false)
    }

    checkLoggedIn()
  }, [])

  // Register new user
  const register = async (userData) => {
    try {
      setError(null)
      const response = await api.post("/api/auth/register", userData)
      return response.data
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed")
      throw err
    }
  }

  // Login user
  const login = async (credentials) => {
    try {
      setError(null)
      const response = await api.post("/api/auth/login", credentials)

      // Handle 2FA if enabled
      if (response.data.twoFactorEnabled) {
        localStorage.setItem("tempToken", response.data.token)
        return { requiresTwoFactor: true }
      }

      // Regular login
      localStorage.setItem("token", response.data.token)

      // Get user data
      const userResponse = await api.get("/api/auth/me")
      setUser(userResponse.data)

      return userResponse.data
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
      throw err
    }
  }

  // Validate 2FA
  const validateTwoFactor = async (token) => {
    try {
      setError(null)
      const tempToken = localStorage.getItem("tempToken")

      if (!tempToken) {
        throw new Error("No temporary token found")
      }

      // Set the temporary token for this request
      api.defaults.headers.common["Authorization"] = `Bearer ${tempToken}`

      const response = await api.post("/api/auth/validate-2fa", { token })

      // Remove temporary token and set the real one
      localStorage.removeItem("tempToken")
      localStorage.setItem("token", tempToken)

      // Get user data
      const userResponse = await api.get("/api/auth/me")
      setUser(userResponse.data)

      // Reset the authorization header
      api.defaults.headers.common["Authorization"] = `Bearer ${tempToken}`

      return userResponse.data
    } catch (err) {
      setError(err.response?.data?.message || "2FA validation failed")
      throw err
    }
  }

  // Logout user
  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    navigate("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        register,
        login,
        logout,
        validateTwoFactor,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
