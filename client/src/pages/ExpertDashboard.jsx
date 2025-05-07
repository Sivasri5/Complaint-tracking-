"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import "./ExpertDashboard.css"

export default function ExpertDashboard() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [filter, setFilter] = useState("all") // all, resolved, open, in_progress, closed
  const [searchTerm, setSearchTerm] = useState("")
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

  const filteredComplaints = complaints
    .filter((complaint) => (filter === "all" ? true : complaint.status === filter))
    .filter((complaint) =>
      searchTerm === "" ? true : complaint.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )

  return (
    <div className="container py-4">
      <div className="card mb-4 dashboard-header-card">
        <div className="card-body">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
            <h2 className="mb-3 mb-md-0 dashboard-title">
              <i className="bi bi-tools me-2"></i>
              Expert Dashboard
            </h2>

            <div className="search-container">
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="btn btn-outline-secondary" type="button">
                  <i className="bi bi-search"></i>
                </button>
              </div>
            </div>
          </div>

          <div className="filter-container">
            <div className="btn-group w-100" role="group">
              <button
                type="button"
                className={`btn ${filter === "all" ? "btn-primary-custom" : "btn-outline-secondary"}`}
                onClick={() => setFilter("all")}
              >
                All
                <span className="badge rounded-pill bg-light text-dark ms-2">{complaints.length}</span>
              </button>
              <button
                type="button"
                className={`btn ${filter === "open" ? "btn-primary-custom" : "btn-outline-secondary"}`}
                onClick={() => setFilter("open")}
              >
                Open
                <span className="badge rounded-pill bg-light text-dark ms-2">
                  {complaints.filter((c) => c.status === "open").length}
                </span>
              </button>
              <button
                type="button"
                className={`btn ${filter === "in_progress" ? "btn-primary-custom" : "btn-outline-secondary"}`}
                onClick={() => setFilter("in_progress")}
              >
                In Progress
                <span className="badge rounded-pill bg-light text-dark ms-2">
                  {complaints.filter((c) => c.status === "in_progress").length}
                </span>
              </button>
              <button
                type="button"
                className={`btn ${filter === "resolved" ? "btn-primary-custom" : "btn-outline-secondary"}`}
                onClick={() => setFilter("resolved")}
              >
                Resolved
                <span className="badge rounded-pill bg-light text-dark ms-2">
                  {complaints.filter((c) => c.status === "resolved").length}
                </span>
              </button>
              <button
                type="button"
                className={`btn ${filter === "closed" ? "btn-primary-custom" : "btn-outline-secondary"}`}
                onClick={() => setFilter("closed")}
              >
                Closed
                <span className="badge rounded-pill bg-light text-dark ms-2">
                  {complaints.filter((c) => c.status === "closed").length}
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary-custom" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading complaints...</p>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
        </div>
      ) : filteredComplaints.length === 0 ? (
        <div className="text-center py-5 bg-white rounded shadow-sm">
          <i className="bi bi-inbox display-1 text-muted mb-3"></i>
          <h3>No complaints found</h3>
          <p className="text-muted">
            {searchTerm
              ? `No results found for "${searchTerm}"`
              : `There are no ${filter !== "all" ? filter.replace("_", " ") + " " : ""}complaints at the moment.`}
          </p>
        </div>
      ) : (
        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover align-middle mb-0">
                <thead className="table-light">
                  <tr>
                    <th scope="col" className="ps-4">
                      ID
                    </th>
                    <th scope="col">Title</th>
                    <th scope="col">Status</th>
                    <th scope="col">Created</th>
                    <th scope="col">Updated</th>
                    <th scope="col" className="text-end pe-4">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredComplaints.map((complaint) => (
                    <tr key={complaint._id} className="complaint-row">
                      <td className="ps-4">
                        <small className="text-muted">{complaint._id.substring(complaint._id.length - 6)}</small>
                      </td>
                      <td>
                        <div className="fw-medium complaint-title-cell">{complaint.title}</div>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(complaint.status)}>
                          {complaint.status.replace("_", " ").toUpperCase()}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-calendar3 me-2 text-muted"></i>
                          <small>{new Date(complaint.createdAt).toLocaleDateString()}</small>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <i className="bi bi-clock-history me-2 text-muted"></i>
                          <small>
                            {complaint.updatedAt
                              ? new Date(complaint.updatedAt).toLocaleDateString()
                              : new Date(complaint.createdAt).toLocaleDateString()}
                          </small>
                        </div>
                      </td>
                      <td className="text-end pe-4">
                        <button
                          className="btn btn-sm btn-outline-primary-custom"
                          onClick={() => navigate(`/complaints/${complaint._id}`)}
                        >
                          <i className="bi bi-chat-dots me-1"></i>
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
