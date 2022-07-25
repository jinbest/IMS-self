import React from "react"
import { Route, Routes, Navigate } from "react-router-dom"
import RequireAuth from "./RequireAuth"
import Home from "./pages/home"
import Login from "./pages/login"

const BaseRouter = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        path="/"
        element={
          <RequireAuth>
            <Home />
          </RequireAuth>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default BaseRouter
