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

  // For likes and comments
  const [showLikes, setShowLikes] = useState({})
  const [showComments, setShowComments] = useState({})
  const [newComment, setNewComment] = useState({})

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
      const messageType = user.role === "expert" ? "reply" : "query"

      // Fix: Make sure we're sending the correct data structure
      const messageData = {
        complaintId: id,
        content: newMessage,
        type: messageType,
      }

      console.log("Sending message data:", messageData)

      const response = await api.post("/api/reactions/conversations", messageData)

      console.log("Message sent successfully:", response.data)
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

  if (loading) {
    return (
      <div className="complaint-detail-container">
        <div className="loading-container">
          <div className="spinner"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="complaint-detail-container">
        <div className="error-message">
          <span>{error}</span>
          <button className="primary-button mt-3" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  if (!complaint) {
    return (
      <div className="complaint-detail-container">
        <div className="warning-message">
          <span>Complaint not found.</span>
          <button className="primary-button mt-3" onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="complaint-detail-container">
      <div className="complaint-detail-card">
        <div className="complaint-detail-header">
          <div className="complaint-detail-title-container">
            <h2 className="complaint-detail-title">{complaint.title}</h2>
            <p className="complaint-detail-date">Created on {new Date(complaint.createdAt).toLocaleDateString()}</p>
          </div>
          <div className="complaint-detail-status-container">
            <span className={`status-badge ${complaint.status}`}>
              {complaint.status.replace("_", " ").toUpperCase()}
            </span>

            {user.role === "expert" && (
              <select
                className="status-select"
                value={complaint.status}
                onChange={(e) => updateComplaintStatus(e.target.value)}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>
            )}
          </div>
        </div>
        <div className="complaint-detail-body">
          <div className="complaint-detail-info">
            <div className="complaint-detail-label">Description</div>
            <div className="complaint-detail-value">{complaint.description}</div>
          </div>
        </div>
      </div>

      <div className="conversation-container">
        <div className="conversation-header">
          <h3 className="conversation-title">Conversation</h3>
        </div>

        <div className="conversation-body">
          <div className="messages-container">
            {conversations.length === 0 ? (
              <div className="messages-empty">No messages yet. Start the conversation!</div>
            ) : (
              <div className="messages-list">
                {conversations.map((message) => {
                  const isCurrentUser = message.author._id === user.id
                  const isExpertReply = message.type === "reply"

                  return (
                    <div
                      key={message._id}
                      className={`message ${isCurrentUser ? "current-user" : "other-user"} ${
                        isExpertReply ? "expert" : "customer"
                      }`}
                    >
                      <div className="message-content">
                        <div className="message-header">
                          <span className="message-author">
                            {message.author.name} ({message.author.role})
                          </span>
                          <span className="message-time">
                            {new Date(message.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                        <p className="message-text">{message.content}</p>

                        <div className="message-actions">
                          <button
                            onClick={() => {
                              const hasLiked = message.reactions?.some(
                                (reaction) => reaction.user === user.id && reaction.type === "like",
                              )
                              if (hasLiked) {
                                handleUnlike(message._id)
                              } else {
                                handleLike(message._id)
                              }
                            }}
                            className={`message-action-btn ${
                              message.reactions?.some(
                                (reaction) => reaction.user === user.id && reaction.type === "like",
                              )
                                ? "active"
                                : ""
                            }`}
                          >
                            <svg className="message-action-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                              />
                            </svg>
                            <span>{message.reactions?.filter((r) => r.type === "like").length || 0} Likes</span>
                          </button>

                          <button onClick={() => toggleLikes(message._id)} className="message-action-btn">
                            View
                          </button>

                          <button onClick={() => toggleComments(message._id)} className="message-action-btn">
                            <svg className="message-action-icon" viewBox="0 0 20 20" fill="none" stroke="currentColor">
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                              />
                            </svg>
                            <span>{message.comments?.length || 0} Comments</span>
                          </button>
                        </div>

                        {showLikes[message._id] && (
                          <div className="likes-panel">
                            <h4 className="likes-title">Likes</h4>
                            {message.reactions?.filter((r) => r.type === "like").length === 0 ? (
                              <p className="likes-empty">No likes yet</p>
                            ) : (
                              <ul className="likes-list">
                                {message.reactions
                                  ?.filter((r) => r.type === "like")
                                  .map((reaction) => (
                                    <li key={reaction._id} className="like-item">
                                      <span className="like-user">{reaction.user.name}</span>
                                      <span className="like-time">{new Date(reaction.createdAt).toLocaleString()}</span>
                                    </li>
                                  ))}
                              </ul>
                            )}
                          </div>
                        )}

                        {showComments[message._id] && (
                          <div className="comments-panel">
                            <h4 className="comments-title">Comments</h4>
                            {message.comments?.length === 0 ? (
                              <p className="comments-empty">No comments yet</p>
                            ) : (
                              <ul className="comments-list">
                                {message.comments?.map((comment) => (
                                  <li key={comment._id} className="comment-item">
                                    <div className="comment-header">
                                      <span className="comment-author">{comment.author.name}</span>
                                      <span className="comment-time">
                                        {new Date(comment.createdAt).toLocaleString()}
                                      </span>
                                    </div>
                                    <p className="comment-text">{comment.content}</p>
                                  </li>
                                ))}
                              </ul>
                            )}

                            <div className="comment-form">
                              <input
                                type="text"
                                value={newComment[message._id] || ""}
                                onChange={(e) =>
                                  setNewComment((prev) => ({
                                    ...prev,
                                    [message._id]: e.target.value,
                                  }))
                                }
                                placeholder="Add a comment..."
                                className="comment-input"
                              />
                              <button onClick={() => handleAddComment(message._id)} className="comment-submit">
                                Send
                              </button>
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

          <form onSubmit={handleSendMessage} className="message-form">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="message-input"
            />
            <button type="submit" disabled={sendingMessage || !newMessage.trim()} className="message-submit">
              {sendingMessage ? "Sending..." : "Send"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
