"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../contexts/AuthContext"
import api from "../services/api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card"

export default function CustomerDasboard() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const response = await api.get("/api/complaints/all") // fetch customer's complaints
        setComplaints(response.data)
      } catch (error) {
        console.error("Error fetching complaints:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchComplaints()
  }, [])

  return (
    <div className="container mx-auto p-6 bg-gray-50 dark:bg-gray-800 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">My Complaints</h1>
        <Link to="/complaints/new">
          <Button variant="primary">Add New Complaint</Button>
        </Link>
      </div>
      {loading ? (
        <div className="text-center text-gray-700 dark:text-gray-300">Loading...</div>
      ) : (
        <>
          {complaints.length === 0 ? (
            <div className="text-center">
              <p className="mb-4 text-gray-600 dark:text-gray-300">No complaints found.</p>
              <Link to="/complaints/new">
                <Button variant="outline">Create your first complaint</Button>
              </Link>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {complaints.map((complaint) => (
                <Card key={complaint._id} className="hover:shadow-xl transition-shadow bg-white dark:bg-gray-700">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-800 dark:text-white">
                      {complaint.title}
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-300">
                      {new Date(complaint.createdAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="text-gray-700 dark:text-gray-200">
                    <p>{complaint.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
