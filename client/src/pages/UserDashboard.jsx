"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import "./UserDashboard.css"

export default function UserDashboard() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/api/complaints")
        setComplaints(response.data)
      } catch (err) {
        console.error("Error fetching complaints:", err)
        setError("Failed to load complaints. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchComplaints()
  }, [])

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "open":
        return "status-badge open"
      case "in_progress":
        return "status-badge in-progress"
      case "resolved":
        return "status-badge resolved"
      case "closed":
        return "status-badge closed"
      default:
        return "status-badge closed"
    }
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">My Complaints</h2>
        <div className="dashboard-actions">
          <Link to="/complaints/new" className="add-complaint-button">
            <svg className="button-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Add New Complaint
          </Link>
        </div>
      </div>

      {loading ? (
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      ) : error ? (
        <div className="error-message">
          <span>{error}</span>
        </div>
      ) : complaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <h3 className="empty-state-title">No complaints found</h3>
            <p className="empty-state-message">You haven't created any complaints yet.</p>
            <Link to="/complaints/new" className="primary-button">
              Create Your First Complaint
            </Link>
          </div>
        </div>
      ) : (
        <div className="complaints-list">
          {complaints.map((complaint) => (
            <div
              key={complaint._id}
              className="complaint-card"
              onClick={() => navigate(`/complaints/${complaint._id}`)}
            >
              <div className="complaint-header">
                <h3 className="complaint-title">{complaint.title}</h3>
                <span className={getStatusBadgeClass(complaint.status)}>
                  {complaint.status.replace("_", " ").toUpperCase()}
                </span>
              </div>
              <div className="complaint-body">
                <p className="complaint-description">
                  {complaint.description.length > 100
                    ? `${complaint.description.substring(0, 100)}...`
                    : complaint.description}
                </p>
              </div>
              <div className="complaint-footer">
                <span className="complaint-date">Created on {new Date(complaint.createdAt).toLocaleDateString()}</span>
                <button className="view-button">View Details</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
