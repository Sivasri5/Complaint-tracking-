"use client"

import { useState } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import "./DashboardLayout.css"

export default function DashboardLayout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const isUserDashboard = location.pathname.includes("/dashboard/user")
  const isExpertDashboard = location.pathname.includes("/dashboard/expert")

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-container">
          <div className="header-left">
            <Link to="/dashboard" className="header-logo">
              Complaint Tracker
            </Link>
            <nav className="header-nav">
              {/* Dashboard type selector */}
              <Link to="/dashboard/user" className={`header-nav-item ${isUserDashboard ? "active" : ""}`}>
                User Dashboard
              </Link>

              {user?.role === "expert" || user?.role === "admin" ? (
                <Link to="/dashboard/expert" className={`header-nav-item ${isExpertDashboard ? "active" : ""}`}>
                  Expert Dashboard
                </Link>
              ) : null}
            </nav>
          </div>
          <div className="header-right">
            <div className="user-info">
              <span className="user-name">
                {user?.name} <span className="user-role">({user?.role})</span>
              </span>
              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>
            </div>
          </div>
          <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="mobile-menu-btn">
            {isMenuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile menu */}
        <div className={`mobile-menu ${isMenuOpen ? "open" : ""}`}>
          <div className="mobile-nav-items">
            <Link to="/dashboard/user" className={`mobile-nav-item ${isUserDashboard ? "active" : ""}`}>
              User Dashboard
            </Link>

            {user?.role === "expert" || user?.role === "admin" ? (
              <Link to="/dashboard/expert" className={`mobile-nav-item ${isExpertDashboard ? "active" : ""}`}>
                Expert Dashboard
              </Link>
            ) : null}
          </div>
          <div className="mobile-user-info">
            <div className="user-avatar">{user?.name?.charAt(0) || "U"}</div>
            <div className="mobile-user-details">
              <div className="mobile-user-name">{user?.name}</div>
              <div className="mobile-user-email">{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} className="mobile-logout">
            Logout
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="dashboard-main">
        <div className="main-container">{children}</div>
      </main>
    </div>
  )
}
