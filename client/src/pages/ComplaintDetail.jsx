"use client"

import { useState, useEffect, useRef } from "react"
import { useParams, useNavigate } from "react-router-dom"
import api from "../services/api"
import { useAuth } from "../contexts/AuthContext"
import "./ComplaintDetail.css"

export default function ComplaintDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [complaint, setComplaint] = useState(null)
  const [conversations, setConversations] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [sendingMessage, setSendingMessage] = useState(false)
  const messagesEndRef = useRef(null)
  const fileInputRef = useRef(null)

  // For likes and comments
  const [showLikes, setShowLikes] = useState({})
  const [showComments, setShowComments] = useState({})
  const [newComment, setNewComment] = useState({})
  const [activeReactions, setActiveReactions] = useState({})
  const [likeAnimations, setLikeAnimations] = useState({})

  useEffect(() => {
    const fetchComplaintDetails = async () => {
      try {
        const complaintResponse = await api.get(`/api/complaints/${id}`)
        setComplaint(complaintResponse.data)

        await fetchConversations()
      } catch (err) {
        console.error("Error fetching complaint details:", err)
        setError("Failed to load complaint details. Please try again.")
      } finally {
        setLoading(false)
      }
    }

    fetchComplaintDetails()

    // Set up polling for new messages
    const intervalId = setInterval(() => {
      fetchConversations()
    }, 10000) // Poll every 10 seconds

    return () => clearInterval(intervalId)
  }, [id])

  const fetchConversations = async () => {
    try {
      const response = await api.get(`/api/reactions/${id}/conversations`)
      setConversations(response.data)
    } catch (err) {
      console.error("Error fetching conversations:", err)
    }
  }

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    scrollToBottom()
  }, [conversations])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim()) return

    setSendingMessage(true)
    setError("")

    try {
      // All users can send messages of any type now
      const messageType = "query" // Default type

      const messageData = {
        complaintId: id,
        content: newMessage,
        type: messageType,
      }

      await api.post("/api/reactions/conversations", messageData)
      setNewMessage("")
      await fetchConversations()
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please try again.")
    } finally {
      setSendingMessage(false)
    }
  }

  const handleLike = async (conversationId) => {
    try {
      await api.post("/api/reactions/reactions", {
        conversationId,
        type: "like",
      })

      // Trigger like animation
      setLikeAnimations((prev) => ({
        ...prev,
        [conversationId]: true,
      }))

      // Reset animation after it completes
      setTimeout(() => {
        setLikeAnimations((prev) => ({
          ...prev,
          [conversationId]: false,
        }))
      }, 1000)

      await fetchConversations()
    } catch (err) {
      console.error("Error liking message:", err)
    }
  }

  const handleUnlike = async (conversationId) => {
    try {
      await api.delete(`/api/reactions/reactions/${conversationId}`)
      await fetchConversations()
    } catch (err) {
      console.error("Error unliking message:", err)
    }
  }

  const handleAddComment = async (conversationId) => {
    if (!newComment[conversationId]?.trim()) return

    try {
      await api.post("/api/reactions/comments", {
        conversationId,
        content: newComment[conversationId],
      })

      // Clear the comment input
      setNewComment((prev) => ({ ...prev, [conversationId]: "" }))

      // Fetch updated comments
      const commentsResponse = await api.get(`/api/reactions/${conversationId}/comments`)

      // Update the conversation with new comments
      setConversations((prevConversations) =>
        prevConversations.map((conv) =>
          conv._id === conversationId ? { ...conv, comments: commentsResponse.data } : conv,
        ),
      )
    } catch (err) {
      console.error("Error adding comment:", err)
    }
  }

  const toggleLikes = async (conversationId) => {
    setShowLikes((prev) => ({
      ...prev,
      [conversationId]: !prev[conversationId],
    }))

    if (!showLikes[conversationId]) {
      try {
        const reactionsResponse = await api.get(`/api/reactions/${conversationId}/reactions`)

        // Update the conversation with reactions
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv._id === conversationId ? { ...conv, reactions: reactionsResponse.data } : conv,
          ),
        )
      } catch (err) {
        console.error("Error fetching reactions:", err)
      }
    }
  }

  const toggleComments = async (conversationId) => {
    setShowComments((prev) => ({
      ...prev,
      [conversationId]: !prev[conversationId],
    }))

    if (!showComments[conversationId]) {
      try {
        const commentsResponse = await api.get(`/api/reactions/${conversationId}/comments`)

        // Update the conversation with comments
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv._id === conversationId ? { ...conv, comments: commentsResponse.data } : conv,
          ),
        )
      } catch (err) {
        console.error("Error fetching comments:", err)
      }
    }
  }

  const updateComplaintStatus = async (status) => {
    try {
      await api.patch(`/api/complaints/${id}`, { status })
      setComplaint((prev) => ({ ...prev, status }))
    } catch (err) {
      console.error("Error updating complaint status:", err)
      setError("Failed to update complaint status. Please try again.")
    }
  }

  const toggleReaction = (conversationId, type) => {
    setActiveReactions((prev) => ({
      ...prev,
      [conversationId]: prev[conversationId] === type ? null : type,
    }))
  }

  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary-custom" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading complaint details...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          {error}
          <div className="mt-3">
            <button className="btn btn-outline-danger" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left me-2"></i>
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning" role="alert">
          <i className="bi bi-exclamation-circle-fill me-2"></i>
          Complaint not found.
          <div className="mt-3">
            <button className="btn btn-outline-warning" onClick={() => navigate(-1)}>
              <i className="bi bi-arrow-left me-2"></i>
              Go Back
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-4">
      <div className="card mb-4 shadow-sm complaint-detail-card">
        <div className="card-header bg-white d-flex flex-column flex-md-row justify-content-between align-items-md-center">
          <div className="mb-3 mb-md-0">
            <h4 className="mb-1 complaint-title">{complaint.title}</h4>
            <div className="text-muted small">
              <i className="bi bi-calendar3 me-1"></i>
              Created on {new Date(complaint.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div className="d-flex align-items-center">
            <span className={`badge ${getStatusBadgeClass(complaint.status)} me-3 status-badge`}>
              {complaint.status.replace("_", " ").toUpperCase()}
            </span>

            {(user.role === "expert" || user.role === "admin") && (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  type="button"
                  id="statusDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Update Status
                </button>
                <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="statusDropdown">
                  <li>
                    <button className="dropdown-item" onClick={() => updateComplaintStatus("open")}>
                      <i className="bi bi-record-circle text-warning me-2"></i>
                      Open
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => updateComplaintStatus("in_progress")}>
                      <i className="bi bi-hourglass-split text-info me-2"></i>
                      In Progress
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => updateComplaintStatus("resolved")}>
                      <i className="bi bi-check-circle text-success me-2"></i>
                      Resolved
                    </button>
                  </li>
                  <li>
                    <button className="dropdown-item" onClick={() => updateComplaintStatus("closed")}>
                      <i className="bi bi-x-circle text-secondary me-2"></i>
                      Closed
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <div className="card-body">
          <h6 className="card-subtitle mb-2 text-muted">Description</h6>
          <p className="card-text">{complaint.description}</p>
        </div>
      </div>

      <div className="card shadow-sm chat-card">
        <div className="card-header bg-white">
          <h5 className="mb-0">
            <i className="bi bi-chat-dots me-2"></i>
            Conversation
          </h5>
        </div>
        <div className="card-body p-0">
          <div className="chat-container">
            <div className="messages-container">
              {conversations.length === 0 ? (
                <div className="text-center py-5 text-muted">
                  <i className="bi bi-chat-dots display-4 mb-3"></i>
                  <p>No messages yet. Start the conversation!</p>
                </div>
              ) : (
                <div className="messages-list p-3">
                  {conversations.map((message) => {
                    const isCurrentUser = message.author._id === user.id
                    const isExpertReply = message.author.role === "expert" || message.author.role === "admin"
                    const hasLiked = message.reactions?.some(
                      (reaction) => reaction.user === user.id && reaction.type === "like",
                    )
                    const likeCount = message.reactions?.filter((r) => r.type === "like").length || 0
                    const commentCount = message.comments?.length || 0

                    return (
                      <div
                        key={message._id}
                        className={`message ${isCurrentUser ? "message-outgoing" : "message-incoming"} ${
                          isExpertReply ? "message-expert" : "message-customer"
                        } mb-3`}
                      >
                        <div
                          className={`message-content ${isCurrentUser ? "outgoing-message-content" : "incoming-message-content"}`}
                        >
                          <div className="message-header">
                            <div className="message-author">
                              <span className="fw-medium">{message.author.name}</span>
                              <span className={`badge ${isExpertReply ? "bg-info" : "bg-secondary"} ms-2`}>
                                {message.author.role}
                              </span>
                            </div>
                            <small className="message-time text-muted">
                              {new Date(message.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </small>
                          </div>
                          <div className="message-body">{message.content}</div>
                          <div className="message-footer">
                            <div className="message-reactions">
                              <button
                                className={`btn btn-sm btn-reaction ${hasLiked ? "active" : ""} ${likeAnimations[message._id] ? "animate-like" : ""}`}
                                onClick={() => {
                                  if (hasLiked) {
                                    handleUnlike(message._id)
                                  } else {
                                    handleLike(message._id)
                                  }
                                }}
                              >
                                <i className={`bi ${hasLiked ? "bi-hand-thumbs-up-fill" : "bi-hand-thumbs-up"}`}></i>
                                <span className="ms-1 like-count">{likeCount}</span>
                              </button>

                              <button
                                className={`btn btn-sm btn-reaction ${showComments[message._id] ? "active" : ""}`}
                                onClick={() => toggleComments(message._id)}
                              >
                                <i className="bi bi-chat"></i>
                                <span className="ms-1">{commentCount}</span>
                              </button>

                              <button className="btn btn-sm btn-reaction" onClick={() => toggleLikes(message._id)}>
                                <i className="bi bi-people"></i>
                                <span className="ms-1">View Likes</span>
                              </button>
                            </div>
                          </div>

                          {showLikes[message._id] && (
                            <div className="reaction-panel">
                              <div className="reaction-panel-header">
                                <h6 className="mb-0">
                                  <i className="bi bi-hand-thumbs-up me-2"></i>
                                  Likes
                                </h6>
                                <button
                                  type="button"
                                  className="btn-close"
                                  onClick={() => toggleLikes(message._id)}
                                ></button>
                              </div>
                              <div className="reaction-panel-body">
                                {message.reactions?.filter((r) => r.type === "like").length === 0 ? (
                                  <p className="text-muted small mb-0">No likes yet</p>
                                ) : (
                                  <ul className="list-group list-group-flush">
                                    {message.reactions
                                      ?.filter((r) => r.type === "like")
                                      .map((reaction) => (
                                        <li
                                          key={reaction._id}
                                          className="list-group-item d-flex justify-content-between align-items-center"
                                        >
                                          <div className="d-flex align-items-center">
                                            <div className="user-avatar-sm me-2">
                                              {reaction.user.name?.charAt(0) || "U"}
                                            </div>
                                            <span>{reaction.user.name}</span>
                                          </div>
                                          <small className="text-muted">
                                            {new Date(reaction.createdAt).toLocaleString()}
                                          </small>
                                        </li>
                                      ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          )}

                          {showComments[message._id] && (
                            <div className="reaction-panel">
                              <div className="reaction-panel-header">
                                <h6 className="mb-0">
                                  <i className="bi bi-chat me-2"></i>
                                  Comments
                                </h6>
                                <button
                                  type="button"
                                  className="btn-close"
                                  onClick={() => toggleComments(message._id)}
                                ></button>
                              </div>
                              <div className="reaction-panel-body">
                                {message.comments?.length === 0 ? (
                                  <p className="text-muted small mb-0">No comments yet</p>
                                ) : (
                                  <ul className="list-group list-group-flush mb-3 comments-list">
                                    {message.comments?.map((comment) => (
                                      <li key={comment._id} className="list-group-item comment-item">
                                        <div className="d-flex">
                                          <div className="user-avatar-sm me-2">
                                            {comment.author.name?.charAt(0) || "U"}
                                          </div>
                                          <div className="comment-content">
                                            <div className="d-flex justify-content-between">
                                              <span className="fw-medium">{comment.author.name}</span>
                                              <small className="text-muted">
                                                {new Date(comment.createdAt).toLocaleString()}
                                              </small>
                                            </div>
                                            <p className="mb-0 mt-1">{comment.content}</p>
                                          </div>
                                        </div>
                                      </li>
                                    ))}
                                  </ul>
                                )}

                                <div className="input-group">
                                  <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Add a comment..."
                                    value={newComment[message._id] || ""}
                                    onChange={(e) =>
                                      setNewComment((prev) => ({
                                        ...prev,
                                        [message._id]: e.target.value,
                                      }))
                                    }
                                    onKeyPress={(e) => {
                                      if (e.key === "Enter") {
                                        handleAddComment(message._id)
                                      }
                                    }}
                                  />
                                  <button
                                    className="btn btn-primary-custom"
                                    onClick={() => handleAddComment(message._id)}
                                  >
                                    <i className="bi bi-send"></i>
                                  </button>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  <div ref={messagesEndRef} />
                </div>
              )}
            </div>

            <div className="message-input-container p-3 border-top">
              <form onSubmit={handleSendMessage} className="d-flex">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Type your message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    disabled={sendingMessage}
                  />
                  <button
                    type="submit"
                    className="btn btn-primary-custom"
                    disabled={sendingMessage || !newMessage.trim()}
                  >
                    {sendingMessage ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      <i className="bi bi-send"></i>
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

function getStatusBadgeClass(status) {
  switch (status) {
    case "open":
      return "bg-warning text-dark"
    case "in_progress":
      return "bg-info text-dark"
    case "resolved":
      return "bg-success"
    case "closed":
      return "bg-secondary"
    default:
      return "bg-secondary"
  }
}
