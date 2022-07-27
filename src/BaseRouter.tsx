import React from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import RequireAuth from "./RequireAuth"
import Dashboard from "./pages/dashboard"
import Family from "./pages/family"
import Login from "./pages/login"

const BaseRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route
        path="/family"
        element={
          <RequireAuth>
            <Family />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default BaseRouter
