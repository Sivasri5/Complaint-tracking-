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
      <div className="header-container">
        <div className="header-content">
          <h1 className="header-logo">
            <Link to="/dashboard">Complaint Portal</Link>
          </h1>

          {/* Mobile menu button */}
          <button className="mobile-menu-btn" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? (
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>

          {/* Desktop navigation */}
          <nav className="desktop-nav">
            {user ? (
              <>
                <Link to="/dashboard/user" className={`nav-link ${isActive("/dashboard/user") ? "active" : ""}`}>
                  User Dashboard
                </Link>

                {(user.role === "expert" || user.role === "admin") && (
                  <Link to="/dashboard/expert" className={`nav-link ${isActive("/dashboard/expert") ? "active" : ""}`}>
                    Expert Dashboard
                  </Link>
                )}

                <div className="user-controls">
                  <span className="user-info">
                    {user.name} ({user.role})
                  </span>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={`nav-link ${isActive("/login") ? "active" : ""}`}>
                  Login
                </Link>
                <Link to="/register" className={`nav-link ${isActive("/register") ? "active" : ""}`}>
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <nav className="mobile-nav">
            {user ? (
              <>
                <Link
                  to="/dashboard/user"
                  className={`mobile-nav-link ${isActive("/dashboard/user") ? "active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  User Dashboard
                </Link>

                {(user.role === "expert" || user.role === "admin") && (
                  <Link
                    to="/dashboard/expert"
                    className={`mobile-nav-link ${isActive("/dashboard/expert") ? "active" : ""}`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Expert Dashboard
                  </Link>
                )}

                <div className="mobile-user-info">
                  <span className="mobile-user-name">
                    {user.name} ({user.role})
                  </span>
                  <button
                    onClick={() => {
                      handleLogout()
                      setIsMenuOpen(false)
                    }}
                    className="mobile-logout-btn"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className={`mobile-nav-link ${isActive("/login") ? "active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className={`mobile-nav-link ${isActive("/register") ? "active" : ""}`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}

export default Header
