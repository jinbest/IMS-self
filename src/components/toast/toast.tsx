import React, { useEffect, useState } from "react"
import Snackbar from "@mui/material/Snackbar"
import Alert from "@mui/material/Alert"
import { ToastParams } from "../../models/toast"

interface ToastProps {
  params: ToastParams
  resetStatuses: () => void
}

type AlertSeverity = "success" | "info" | "error" | "warning"

const Toast = ({ params, resetStatuses }: ToastProps) => {
  const [openAlert, setOpenAlert] = useState(false)
  const [alertMsg, setAlertMsg] = useState("")

  useEffect(() => {
    const { msg, isError, isSuccess, isInfo, isWarning } = params
    setAlertMsg(msg ? msg : "")

    if ((isError || isSuccess || isInfo || isWarning) && !openAlert) {
      setOpenAlert(true)
    }
  }, [params])

  const setSeverity = (): AlertSeverity => {
    const { isError, isSuccess, isInfo, isWarning } = params
    let severity: AlertSeverity = "info"

    if (isError) {
      severity = "error"
    } else if (isSuccess) {
      severity = "success"
    } else if (isWarning) {
      severity = "warning"
    } else if (isInfo) {
      severity = "info"
    }

    return severity
  }

  const closeAlert = () => {
    setOpenAlert(false)
    setAlertMsg("")
    resetStatuses()
  }

  return (
    <>
      <Snackbar
        open={openAlert}
        autoHideDuration={2000}
        onClose={closeAlert}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        style={{ zIndex: 2000 }}
      >
        <Alert onClose={closeAlert} severity={setSeverity()}>
          {alertMsg}
        </Alert>
      </Snackbar>
    </>
  )
}

export default Toast
