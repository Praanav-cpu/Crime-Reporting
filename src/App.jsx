"use client"
import { Routes, Route, Navigate } from "react-router-dom"
import { useAuth } from "./hooks/useAuth"
import LoginPage from "./pages/auth/LoginPage"
import RegisterPage from "./pages/auth/RegisterPage"
import DashboardPage from "./pages/DashboardPage"
import ReportCrimePage from "./pages/ReportCrimePage"
import CasesPage from "./pages/CasesPage"
import AnalyticsPage from "./pages/AnalyticsPage"
import MissingItemsPage from "./pages/MissingItemsPage"
import UsersPage from "./pages/admin/UsersPage"
import PageContainer from "./components/layout/PageContainer"

const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/login" />
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <PageContainer />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="/dashboard" />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="report-crime" element={<ReportCrimePage />} />
        <Route path="cases" element={<CasesPage />} />
        <Route path="analytics" element={<AnalyticsPage />} />
        <Route path="missing" element={<MissingItemsPage />} />
        <Route
          path="admin/users"
          element={
            <ProtectedRoute requiredRole="admin">
              <UsersPage />
            </ProtectedRoute>
          }
        />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  )
}

export default App

