"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../services/api"
import "./CreateComplaint.css"

export default function CreateComplaint() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await api.post("/api/complaints", { title, description })
      navigate("/dashboard/user")
    } catch (err) {
      console.error("Failed to create complaint:", err)
      setError("Failed to create complaint. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="create-complaint-container">
      <div className="create-complaint-header">
        <h2 className="create-complaint-title">Create New Complaint</h2>
        <p className="create-complaint-description">
          Please provide details about your issue. Be as specific as possible to help our experts assist you better.
        </p>
      </div>

      <div className="create-complaint-form-wrapper">
        <form onSubmit={handleSubmit} className="create-complaint-form">
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="form-input"
              placeholder="Brief title of your complaint"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="form-textarea"
              placeholder="Detailed description of your issue"
            />
            <p className="form-help-text">Include any relevant details that might help in resolving your complaint.</p>
          </div>

          <div className="form-actions">
            <button type="button" onClick={() => navigate("/dashboard/user")} className="cancel-button">
              Cancel
            </button>
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? "Submitting..." : "Submit Complaint"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
