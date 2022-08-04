import React from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import RequireAuth from "./RequireAuth"
import Dashboard from "./pages/dashboard"
import Members from "./pages/members"
import Profile from "./pages/profile"
import Login from "./pages/login"

const BaseRouter = () => {
  return (
    <Routes>
      <Route path="/auth" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/members"
        element={
          <RequireAuth>
            <Members />
          </RequireAuth>
        }
      />

      <Route
        path="/profile"
        element={
          <RequireAuth>
            <Profile />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default BaseRouter
