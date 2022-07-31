import React, { useState, useEffect } from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogContentText from "@mui/material/DialogContentText"
import DialogTitle from "@mui/material/DialogTitle"
import { observer } from "mobx-react"
import { GenderParam } from "../../models/member"

interface PopupMemberCreateProps {
  open: boolean
  setOpen: (val: boolean) => void
}

const PopupMemberCreate = ({ open, setOpen }: PopupMemberCreateProps) => {
  const [fullname, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState<GenderParam>("M")
  const [birthday, setBirthDay] = useState("")
  const [job, setJob] = useState("")
  const [address, setAddress] = useState("")
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (fullname && email && gender && birthday && job && address) {
      setDisabled(false)
    }
  }, [fullname, email, gender, birthday, job, address])

  const handleSubmit = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Create new member</DialogTitle>
        <DialogContent>
          <DialogContentText>Please fill below form before submit.</DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="fullname"
            label="Full Name"
            type="text"
            fullWidth
            variant="standard"
            value={fullname}
            onChange={(e) => {
              setFullName(e.target.value)
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="standard"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="gender"
            label="Gender"
            type="text"
            fullWidth
            variant="standard"
            value={gender}
            onChange={(e) => {
              setGender(e.target.value as GenderParam)
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="birthday"
            label="Birthday"
            type="text"
            fullWidth
            variant="standard"
            value={birthday}
            onChange={(e) => {
              setBirthDay(e.target.value)
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="job"
            label="Job"
            type="text"
            fullWidth
            variant="standard"
            value={job}
            onChange={(e) => {
              setJob(e.target.value)
            }}
          />
          <TextField
            autoFocus
            margin="dense"
            id="address"
            label="Address"
            type="text"
            fullWidth
            variant="standard"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button disabled={disabled} onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default observer(PopupMemberCreate)
