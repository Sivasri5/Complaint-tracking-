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
  const [formSubmitted, setFormSubmitted] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")
    setFormSubmitted(true)

    if (!title.trim() || !description.trim()) {
      setLoading(false)
      return
    }

    try {
      await api.post("/api/complaints", { title, description })
      // Show success animation before redirecting
      setTimeout(() => {
        navigate("/dashboard/user")
      }, 1500)
    } catch (err) {
      console.error("Failed to create complaint:", err)
      setError("Failed to create complaint. Please try again.")
      setLoading(false)
      setFormSubmitted(false)
    }
  }

  return (
    <div className="container py-4">
      <div className="row">
        <div className="col-lg-4 mb-4 mb-lg-0">
          <div className="sticky-top pt-3" style={{ top: "1rem" }}>
            <h2 className="mb-3 create-complaint-title">Create New Complaint</h2>
            <div className="card bg-light border-0 tips-card">
              <div className="card-body">
                <h5 className="card-title">
                  <i className="bi bi-lightbulb me-2"></i>
                  Tips for a Good Complaint
                </h5>
                <ul className="card-text mb-0 tips-list">
                  <li>Be clear and concise in your title</li>
                  <li>Provide specific details in your description</li>
                  <li>Include any relevant information like dates, locations, etc.</li>
                  <li>Explain what resolution you're looking for</li>
                  <li>Be respectful and constructive</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="card shadow-sm complaint-form-card">
            <div className="card-header bg-white">
              <h5 className="mb-0">Complaint Details</h5>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <i className="bi bi-exclamation-triangle-fill me-2"></i>
                  {error}
                </div>
              )}

              {formSubmitted && !error && (
                <div className="alert alert-success" role="alert">
                  <i className="bi bi-check-circle-fill me-2"></i>
                  Complaint submitted successfully! Redirecting...
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className={`form-control ${formSubmitted && !title.trim() ? "is-invalid" : ""}`}
                    id="title"
                    placeholder="Brief title of your complaint"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                  {formSubmitted && !title.trim() && (
                    <div className="invalid-feedback">Please provide a title for your complaint</div>
                  )}
                  <div className="form-text">A clear, concise title helps experts understand your issue quickly</div>
                </div>

                <div className="mb-4">
                  <label htmlFor="description" className="form-label">
                    Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${formSubmitted && !description.trim() ? "is-invalid" : ""}`}
                    id="description"
                    rows="6"
                    placeholder="Detailed description of your issue"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                  ></textarea>
                  {formSubmitted && !description.trim() && (
                    <div className="invalid-feedback">Please provide a description of your complaint</div>
                  )}
                  <div className="form-text">
                    Include all relevant details that might help in resolving your complaint
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => navigate("/dashboard/user")}
                  >
                    <i className="bi bi-x me-2"></i>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary-custom" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send me-2"></i>
                        Submit Complaint
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
