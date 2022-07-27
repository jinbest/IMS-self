import React, { useEffect } from "react"
import { observer } from "mobx-react"
import { store } from "../store"
import { useNavigate } from "react-router-dom"
import CustomCard from "../components/CustomCard"
import Button from "@mui/material/Button"

const Login = () => {
  const { login_status, setLoginStatus } = store

  const navigate = useNavigate()

  useEffect(() => {
    if (login_status) {
      navigate("/dashboard")
    }
  }, [login_status])

  const handleLogin = () => {
    setLoginStatus(true)
  }

  return (
    <div className="page login">
      <CustomCard width={480} height="fit-content">
        <div className="login-container">
          <p>login page</p>
          <Button variant="outlined" onClick={handleLogin}>
            Login
          </Button>
        </div>
      </CustomCard>
    </div>
  )
}

export default observer(Login)
