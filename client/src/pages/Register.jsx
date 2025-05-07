"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./Register.css"

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
  })
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const [passwordStrength, setPasswordStrength] = useState(0)

  const { register } = useAuth()
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Calculate password strength
    if (name === "password") {
      calculatePasswordStrength(value)
    }
  }

  const calculatePasswordStrength = (password) => {
    let strength = 0

    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setPasswordStrength(strength)
  }

  const getPasswordStrengthText = () => {
    switch (passwordStrength) {
      case 0:
        return "Weak"
      case 1:
        return "Fair"
      case 2:
        return "Good"
      case 3:
        return "Strong"
      case 4:
        return "Very Strong"
      default:
        return "Weak"
    }
  }

  const getPasswordStrengthClass = () => {
    switch (passwordStrength) {
      case 0:
        return "bg-danger"
      case 1:
        return "bg-warning"
      case 2:
        return "bg-info"
      case 3:
        return "bg-success"
      case 4:
        return "bg-success"
      default:
        return "bg-danger"
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setSuccess("")

    try {
      await register(formData)
      setSuccess("Registration successful! Redirecting to login...")
      setTimeout(() => navigate("/login"), 2000)
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="card shadow-lg border-0 register-card">
        <div className="card-body p-4 p-md-5">
          <div className="text-center mb-4">
            <h2 className="fw-bold mb-2 register-title">Create an Account</h2>
            <p className="text-muted">
              Already have an account?{" "}
              <Link to="/login" className="text-decoration-none">
                Sign in
              </Link>
            </p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success" role="alert">
              <i className="bi bi-check-circle-fill me-2"></i>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <div className="mb-3">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person"></i>
                </span>
                <input
                  id="name"
                  name="name"
                  type="text"
                  className="form-control"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  autoFocus
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="form-label">
                Email address
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-envelope"></i>
                </span>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-lock"></i>
                </span>
                <input
                  id="password"
                  name="password"
                  type="password"
                  className="form-control"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              {formData.password && (
                <div className="mt-2">
                  <div className="d-flex justify-content-between align-items-center mb-1">
                    <small>Password strength: {getPasswordStrengthText()}</small>
                    <small
                      className={`text-${passwordStrength >= 3 ? "success" : passwordStrength >= 2 ? "info" : passwordStrength >= 1 ? "warning" : "danger"}`}
                    >
                      {passwordStrength}/4
                    </small>
                  </div>
                  <div className="progress" style={{ height: "6px" }}>
                    <div
                      className={`progress-bar ${getPasswordStrengthClass()}`}
                      role="progressbar"
                      style={{ width: `${passwordStrength * 25}%` }}
                      aria-valuenow={passwordStrength * 25}
                      aria-valuemin="0"
                      aria-valuemax="100"
                    ></div>
                  </div>
                  <div className="form-text mt-1">Password must be at least 8 characters long</div>
                </div>
              )}
            </div>

            <div className="mb-4">
              <label htmlFor="role" className="form-label">
                Account Type
              </label>
              <div className="input-group">
                <span className="input-group-text">
                  <i className="bi bi-person-badge"></i>
                </span>
                <select
                  id="role"
                  name="role"
                  className="form-select"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="customer">Customer</option>
                  <option value="expert">Expert</option>
                </select>
              </div>
              <div className="form-text">
                {formData.role === "customer"
                  ? "As a customer, you can create complaints and track their status"
                  : "As an expert, you can help resolve customer complaints"}
              </div>
            </div>

            <div className="mb-4">
              <div className="form-check">
                <input className="form-check-input" type="checkbox" id="termsCheck" required />
                <label className="form-check-label" htmlFor="termsCheck">
                  I agree to the{" "}
                  <a href="#" className="text-decoration-none">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-decoration-none">
                    Privacy Policy
                  </a>
                </label>
              </div>
            </div>

            <button type="submit" className="btn btn-primary-custom btn-lg w-100" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Creating Account...
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
