"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./Header.css"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // Check if the current route is active
  const isActive = (path) => {
    return location.pathname === path
  }

  return (
    <header className="main-header">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link className="navbar-brand fw-bold" to="/dashboard">
            <i className="bi bi-chat-dots-fill me-2"></i>
            Complaint Portal
          </Link>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {user ? (
                <>
                  <li className="nav-item">
                    <Link to="/dashboard/user" className={`nav-link ${isActive("/dashboard/user") ? "active" : ""}`}>
                      <i className="bi bi-person-fill me-1"></i>
                      User Dashboard
                    </Link>
                  </li>

                  {(user.role === "expert" || user.role === "admin") && (
                    <li className="nav-item">
                      <Link
                        to="/dashboard/expert"
                        className={`nav-link ${isActive("/dashboard/expert") ? "active" : ""}`}
                      >
                        <i className="bi bi-tools me-1"></i>
                        Expert Dashboard
                      </Link>
                    </li>
                  )}

                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      id="navbarDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <i className="bi bi-person-circle me-1"></i>
                      {user.name}
                    </a>
                    <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="navbarDropdown">
                      <li>
                        <div className="dropdown-item-text">
                          <small className="d-block text-muted">Signed in as</small>
                          <span className="fw-medium">{user.email}</span>
                          <span className="badge bg-secondary ms-2">{user.role}</span>
                        </div>
                      </li>
                      <li>
                        <hr className="dropdown-divider" />
                      </li>
                      <li>
                        <button onClick={handleLogout} className="dropdown-item text-danger">
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Logout
                        </button>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <Link to="/login" className={`nav-link ${isActive("/login") ? "active" : ""}`}>
                      <i className="bi bi-box-arrow-in-right me-1"></i>
                      Login
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link to="/register" className={`nav-link ${isActive("/register") ? "active" : ""}`}>
                      <i className="bi bi-person-plus-fill me-1"></i>
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </header>
  )
}

export default Header
