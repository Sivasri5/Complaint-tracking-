"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import "./ExpertDashboard.css"

export default function ExpertDashboard() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all") // all, resolved
  const navigate = useNavigate()

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/api/complaints/all")
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

  const filteredComplaints =
    filter === "all" ? complaints : complaints.filter((complaint) => complaint.status === "resolved")

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2 className="dashboard-title">All Complaints</h2>
        <div className="filter-controls">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={filter === "all" ? "filter-button active" : "filter-button"}
          >
            All Complaints
          </button>
          <button
            type="button"
            onClick={() => setFilter("resolved")}
            className={filter === "resolved" ? "filter-button active" : "filter-button"}
          >
            Resolved Complaints
          </button>
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
      ) : filteredComplaints.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-content">
            <h3 className="empty-state-title">No complaints found</h3>
            <p className="empty-state-message">
              There are no {filter === "resolved" ? "resolved " : ""}complaints at the moment.
            </p>
          </div>
        </div>
      ) : (
        <div className="complaints-list">
          {filteredComplaints.map((complaint) => (
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
                  {complaint.description && complaint.description.length > 100
                    ? `${complaint.description.substring(0, 100)}...`
                    : complaint.description || "No description provided"}
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
