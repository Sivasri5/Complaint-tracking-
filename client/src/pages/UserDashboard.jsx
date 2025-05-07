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
  const [filter, setFilter] = useState("all")
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
        return "badge bg-warning text-dark"
      case "in_progress":
        return "badge bg-info text-dark"
      case "resolved":
        return "badge bg-success"
      case "closed":
        return "badge bg-secondary"
      default:
        return "badge bg-secondary"
    }
  }

  const filteredComplaints =
    filter === "all" ? complaints : complaints.filter((complaint) => complaint.status === filter)

  return (
    <div className="container py-4">
      <div className="dashboard-header mb-4">
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <h2 className="mb-3 mb-md-0 dashboard-title">
            <i className="bi bi-list-ul me-2"></i>
            My Complaints
          </h2>
          <div className="d-flex gap-3 align-items-center">
            <div className="btn-group filter-buttons" role="group">
              <button
                type="button"
                className={`btn ${filter === "all" ? "btn-primary-custom" : "btn-outline-secondary"}`}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={`btn ${filter === "open" ? "btn-primary-custom" : "btn-outline-secondary"}`}
                onClick={() => setFilter("open")}
              >
                Open
              </button>
              <button
                type="button"
                className={`btn ${filter === "in_progress" ? "btn-primary-custom" : "btn-outline-secondary"}`}
                onClick={() => setFilter("in_progress")}
              >
                In Progress
              </button>
              <button
                type="button"
                className={`btn ${filter === "resolved" ? "btn-primary-custom" : "btn-outline-secondary"}`}
                onClick={() => setFilter("resolved")}
              >
                Resolved
              </button>
              <button
                type="button"
                className={`btn ${filter === "closed" ? "btn-primary-custom" : "btn-outline-secondary"}`}
                onClick={() => setFilter("closed")}
              >
                Closed
              </button>
            </div>
            <Link to="/complaints/new" className="btn btn-primary-custom">
              <i className="bi bi-plus-circle me-2"></i>
              New Complaint
            </Link>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary-custom" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading your complaints...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="text-center py-5 bg-white rounded shadow-sm empty-state">
          <i className="bi bi-inbox display-1 text-muted mb-3"></i>
          <h3>No complaints found</h3>
          <p className="text-muted mb-4">
            {filter === "all"
              ? "You haven't submitted any complaints yet."
              : `You don't have any ${filter.replace("_", " ")} complaints.`}
          </p>
          <Link to="/complaints/new" className="btn btn-primary-custom">
            <i className="bi bi-plus-circle me-2"></i>
            Create Your First Complaint
          </Link>
        </div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {filteredComplaints.map((complaint) => (
            <div className="col" key={complaint._id}>
              <div className="card h-100 complaint-card" onClick={() => navigate(`/complaints/${complaint._id}`)}>
                <div className="card-header d-flex justify-content-between align-items-center">
                  <span className={getStatusBadgeClass(complaint.status)}>
                    {complaint.status.replace("_", " ").toUpperCase()}
                  </span>
                  <small className="text-muted">
                    <i className="bi bi-calendar3 me-1"></i>
                    {new Date(complaint.createdAt).toLocaleDateString()}
                  </small>
                </div>
                <div className="card-body">
                  <h5 className="card-title">{complaint.title}</h5>
                  <p className="card-text">
                    {complaint.description.length > 100
                      ? `${complaint.description.substring(0, 100)}...`
                      : complaint.description}
                  </p>
                </div>
                <div className="card-footer bg-transparent">
                  <button className="btn btn-sm btn-outline-primary-custom w-100">
                    <i className="bi bi-chat-dots me-2"></i>
                    View Conversation
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
