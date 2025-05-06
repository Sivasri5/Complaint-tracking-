import { Routes, Route, Navigate } from "react-router-dom"
import ProtectedRoute from "./components/ProtectedRoute"
import Header from "./components/Header"
import Footer from "./components/Footer"
import Register from "./pages/Register"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import UserDashboard from "./pages/UserDashboard"
import ExpertDashboard from "./pages/ExpertDashboard"
import CreateComplaint from "./pages/CreateComplaint"
import ComplaintDetail from "./pages/ComplaintDetail"
import "./App.css"

function App() {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/user" element={<UserDashboard />} />
            <Route path="/complaints/new" element={<CreateComplaint />} />
            <Route path="/complaints/:id" element={<ComplaintDetail />} />
          </Route>

          {/* Expert-only routes */}
          <Route element={<ProtectedRoute allowedRoles={["expert", "admin"]} />}>
            <Route path="/dashboard/expert" element={<ExpertDashboard />} />
          </Route>

          {/* Redirect root to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
