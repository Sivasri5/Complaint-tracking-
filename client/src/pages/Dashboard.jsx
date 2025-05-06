"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import DashboardLayout from "../components/DashboardLayout"

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    // Redirect to the appropriate dashboard based on user role
    if (user) {
      navigate("/dashboard/user")
    }
  }, [user, navigate])

  return (
    <DashboardLayout>
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    </DashboardLayout>
  )
}
