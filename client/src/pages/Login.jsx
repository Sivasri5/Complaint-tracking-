"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./Login.css"

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [twoFactorCode, setTwoFactorCode] = useState("")
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const { login, validateTwoFactor } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const result = await login(formData)

      if (result.requiresTwoFactor) {
        setRequiresTwoFactor(true)
      } else {
        navigate("/dashboard")
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please check your credentials.")
    } finally {
      setLoading(false)
    }
  }

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await validateTwoFactor(twoFactorCode)
      navigate("/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "2FA validation failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">{requiresTwoFactor ? "Enter Two-Factor Code" : "Sign in to your account"}</h2>
        {!requiresTwoFactor && (
          <p className="login-subtitle">
            Or{" "}
            <Link to="/register" className="login-link">
              create a new account
            </Link>
          </p>
        )}

        {error && (
          <div className="login-error">
            <span>{error}</span>
          </div>
        )}

        {requiresTwoFactor ? (
          <form className="login-form" onSubmit={handleTwoFactorSubmit}>
            <div className="form-group">
              <label htmlFor="twoFactorCode" className="form-label">
                Two-Factor Authentication Code
              </label>
              <input
                id="twoFactorCode"
                name="twoFactorCode"
                type="text"
                required
                className="form-input two-factor-input"
                placeholder="Enter your 6-digit code"
                value={twoFactorCode}
                onChange={(e) => setTwoFactorCode(e.target.value)}
              />
            </div>

            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Verifying..." : "Verify Code"}
            </button>
          </form>
        ) : (
          <form className="login-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="form-input"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="form-input"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div className="login-footer">
              <Link to="/forgot-password" className="login-link">
                Forgot your password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="login-button">
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
