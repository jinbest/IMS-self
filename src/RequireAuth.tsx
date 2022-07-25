import React from "react"
import { useLocation, Navigate } from "react-router-dom"
import { observer } from "mobx-react"
import { store } from "./store"

const RequireAuth = ({ children }: { children: JSX.Element }) => {
  const { login_status } = store

  const location = useLocation()

  if (!login_status) {
    return <Navigate to="/login" state={{ from: location }} replace />
  } else {
    return children
  }
}

export default observer(RequireAuth)
