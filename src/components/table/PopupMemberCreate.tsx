import React, { useState, useEffect } from "react"
import Button from "@mui/material/Button"
import TextField from "@mui/material/TextField"
import Dialog from "@mui/material/Dialog"
import DialogActions from "@mui/material/DialogActions"
import DialogContent from "@mui/material/DialogContent"
import DialogTitle from "@mui/material/DialogTitle"
import InputLabel from "@mui/material/InputLabel"
import FormControl from "@mui/material/FormControl"
import Select, { SelectChangeEvent } from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import { observer } from "mobx-react"
import { GenderParam, MemberParam } from "../../models/member"
import { otherStore } from "../../store"
import ApiClient from "../../services/api-client"
import Config from "../../config/config"
import moment from "moment"

const apiClient = ApiClient.getInstance()

interface PopupMemberCreateProps {
  open: boolean
  setOpen: (val: boolean) => void
  rows: MemberParam[]
  setRows: (val: MemberParam[]) => void
}

const PopupMemberCreate = ({ open, setOpen, rows, setRows }: PopupMemberCreateProps) => {
  const { setLoading, setToastParams } = otherStore

  const [fullname, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [gender, setGender] = useState<GenderParam>("M")
  const [birthday, setBirthDay] = useState("2000-01-01")
  const [job, setJob] = useState("")
  const [address, setAddress] = useState("")
  const [disabled, setDisabled] = useState(true)

  useEffect(() => {
    if (fullname && email && gender && birthday && job && address) {
      setDisabled(false)
    } else {
      setDisabled(true)
    }
  }, [fullname, email, gender, birthday, job, address])

  const clear = () => {
    setFullName("")
    setEmail("")
    setGender("M")
    setBirthDay("2000-01-01")
    setJob("")
    setAddress("")
  }

  const handleSubmit = async (e: React.MouseEvent<unknown>) => {
    e.preventDefault()
    const data = { fullname, email, gender, birthday, job, address }

    setLoading(true)
    let msg = "One member has been added successfully.",
      isFailed = false

    try {
      const results = await apiClient.post<{ insertedId: string }>(
        `${Config.BASE_URL}/members/create`,
        { data }
      )
      if (results && results.insertedId) {
        rows.push({ ...data, _id: results.insertedId })
        setRows([...rows])
      } else {
        msg = "Nothing has been added."
      }
    } catch (e) {
      console.log("Something went wrong", e)
      msg = "Something went wrong while create new member."
      isFailed = true
    } finally {
      setLoading(false)
      setToastParams({
        msg,
        isSuccess: !isFailed,
        isError: isFailed,
      })
      clear()
      setOpen(false)
    }
  }

  const handleGenderChange = (event: SelectChangeEvent) => {
    setGender(event.target.value as GenderParam)
  }

  const handleClose = () => {
    clear()
    setOpen(false)
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} className="create-new-member-popup">
        <DialogTitle>Create new member</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="fullname"
            label="Full Name"
            type="text"
            fullWidth
            variant="outlined" // filled | outlined | standard
            value={fullname}
            onChange={(e) => {
              setFullName(e.target.value)
            }}
          />

          <TextField
            margin="dense"
            id="email"
            label="Email"
            type="email"
            fullWidth
            variant="outlined"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />

          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={gender}
              label="Gender"
              onChange={handleGenderChange}
            >
              <MenuItem value={"M"}>M</MenuItem>
              <MenuItem value={"F"}>F</MenuItem>
            </Select>
          </FormControl>

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Birthday"
              value={birthday}
              onChange={(newValue) => {
                if (newValue) {
                  setBirthDay(moment(newValue).format("YYYY-MM-DD"))
                }
              }}
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>

          <TextField
            margin="dense"
            id="job"
            label="Job"
            type="text"
            fullWidth
            variant="outlined"
            value={job}
            onChange={(e) => {
              setJob(e.target.value)
            }}
          />

          <TextField
            margin="dense"
            id="address"
            label="Address"
            type="text"
            fullWidth
            variant="outlined"
            value={address}
            onChange={(e) => {
              setAddress(e.target.value)
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="text">
            Cancel
          </Button>
          {/* eslint-disable-next-line @typescript-eslint/no-misused-promises */}
          <Button disabled={disabled} variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default observer(PopupMemberCreate)
