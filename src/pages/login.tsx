import React, { useEffect, useState } from "react"
import { observer } from "mobx-react"
import { store, otherStore } from "../store"
import { useNavigate } from "react-router-dom"
import CustomCard from "../components/CustomCard"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import ApiClient from "../services/api-client"
import Config from "../config/config"

const apiClient = ApiClient.getInstance()

const Login = () => {
  const { login_status, setLoginStatus, setUser } = store
  const { setLoading, setToastParams } = otherStore

  const [username, setUserName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confpass, setConfPass] = useState("")
  const [tab_login, setTabLogin] = useState(true)
  const [disabled, setDisabled] = useState(true)

  const navigate = useNavigate()

  useEffect(() => {
    if (login_status) {
      navigate("/members")
    }
  }, [login_status])

  useEffect(() => {
    if (tab_login) {
      if (username && password) {
        setDisabled(false)
      }
    } else {
      if (username && email && password && password === confpass) {
        setDisabled(false)
      }
    }
  }, [username, password, tab_login, email, confpass])

  const handleAuth = () => {
    if (tab_login && username && password) {
      onLoginRequest({ username, password })
    } else if (!tab_login && username && password && password === confpass) {
      onRegisterRequest({ username, email, password })
    }
  }

  const onLoginRequest = async (data: { username: string; password: string }) => {
    setLoading(true)
    let msg = "You've been logged in successfully.",
      isFailed = false

    try {
      const results = await apiClient.post<{
        success: boolean
        message?: string
        isAdmin?: boolean
        email?: string
      }>(`${Config.BASE_URL}/users/login`, data)
      if (results && results.success) {
        setUser({ username, email: results.email || "", isAdmin: results.isAdmin || false })
        setLoginStatus(true)
      } else {
        msg = results.message || "This username does not have an account."
        isFailed = true
      }
    } catch (e) {
      console.log("Something went wrong", e)
      msg = "Login failed."
      isFailed = true
    } finally {
      setLoading(false)
      setToastParams({
        msg,
        isSuccess: !isFailed,
        isError: isFailed,
      })
    }
  }

  const onRegisterRequest = async (data: { username: string; email: string; password: string }) => {
    setLoading(true)
    let msg = "You've been logged in successfully.",
      isFailed = false

    try {
      const results = await apiClient.post<{
        success: boolean
        message?: string
        isAdmin?: boolean
      }>(`${Config.BASE_URL}/users/register`, data)
      console.log("onRegisterRequest:results", results)

      if (results && results.success) {
        setUser({ username, email, isAdmin: results.isAdmin || false })
        setLoginStatus(true)
      } else {
        msg = results.message || "This username has been registered already."
        isFailed = true
      }
    } catch (e) {
      console.log("Something went wrong", e)
      msg = "Register failed."
      isFailed = true
    } finally {
      setLoading(false)
      setToastParams({
        msg,
        isSuccess: !isFailed,
        isError: isFailed,
      })
    }
  }

  return (
    <div className="page login">
      <CustomCard width={480} height="fit-content">
        <div className="login-container">
          <h2>{tab_login ? "Login" : "Register"}</h2>

          <TextField
            autoFocus
            margin="dense"
            id="username"
            label="Username"
            type="text"
            fullWidth
            variant="outlined"
            value={username}
            onChange={(e) => {
              setUserName(e.target.value)
            }}
          />

          {!tab_login ? (
            <TextField
              margin="dense"
              id="email"
              label="Email"
              type="text"
              fullWidth
              variant="outlined"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
              }}
            />
          ) : null}

          <TextField
            margin="dense"
            id="password"
            label="Password"
            type="password"
            fullWidth
            variant="outlined"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />

          {!tab_login && (
            <TextField
              margin="dense"
              id="confpass"
              label="Confirm Password"
              type="password"
              fullWidth
              variant="outlined"
              value={confpass}
              onChange={(e) => {
                setConfPass(e.target.value)
              }}
            />
          )}

          <Button disabled={disabled} variant="outlined" onClick={handleAuth}>
            {tab_login ? "Login" : "Register"}
          </Button>

          <p>
            {tab_login ? "If you don't have an account yet, " : "If you've an account already, "}
            <span
              onClick={() => {
                setTabLogin(!tab_login)
              }}
            >
              {tab_login ? "register" : "login"}
            </span>
          </p>
        </div>
      </CustomCard>
    </div>
  )
}

export default observer(Login)
