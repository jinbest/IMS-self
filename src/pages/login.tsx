import React, { useEffect } from "react"
import { observer } from "mobx-react"
import { store } from "../store"
import { useNavigate } from "react-router-dom"

const Login = () => {
  const { login_status } = store

  const navigate = useNavigate()

  useEffect(() => {
    if (login_status) {
      navigate("/")
    }
  }, [login_status])

  return <p>{`login page`}</p>
}

export default observer(Login)
