import React, { useState } from "react"
import CustomCard from "../components/CustomCard"
import { observer } from "mobx-react"
import { store, otherStore } from "../store"
import Grid from "@mui/material/Grid"
import Avatar from "@mui/material/Avatar"
import { deepOrange } from "@mui/material/colors"
import TextField from "@mui/material/TextField"
// import { UserParam } from "../models/user"
import Button from "@mui/material/Button"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"
import { DatePicker } from "@mui/x-date-pickers/DatePicker"
import moment from "moment"
import AvatarUploader from "../components/AvatarUploader"
import ApiClient from "../services/api-client"
import Config from "../config/config"

const apiClient = ApiClient.getInstance()

const Profile = () => {
  const { user, setUser } = store
  const { setLoading, setToastParams } = otherStore

  const [edit_status, setEditStatus] = useState(false)
  const [birthday, setBirthDay] = useState(user.birthday || "2000-01-01")
  const [avatar, setAvatar] = useState(user.avatar || "")
  const [images, setImages] = useState<any[]>([])

  const init = () => {
    setBirthDay(user.birthday || "2000-01-01")
    setAvatar(user.avatar || "")
    setImages([])
    setEditStatus(false)
  }

  const handleForm = () => {
    if (!edit_status) {
      setEditStatus(true)
    } else {
      handleSubmit()
    }
  }

  const handleSubmit = async () => {
    if (!images || !images.length) return

    setLoading(true)
    let msg = "Your info has been updated successfully.",
      isFailed = false

    const formData = new FormData()
    formData.append("username", user.username)
    formData.append("birthday", birthday)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    formData.append("profileImg", images[0].file)

    try {
      const results = await apiClient.post<{ success: boolean }>(
        `${Config.BASE_URL}/users/update/${user.username}`,
        formData,
        {}
      )
      if (results.success) {
        user.avatar = avatar
        user.birthday = birthday
        setUser({ ...user })
      } else {
        msg = "Nothing has been updated."
      }
    } catch (e) {
      console.log("Something went wrong", e)
      msg = "Something went wrong to update your profile."
      isFailed = true
      init()
    } finally {
      setLoading(false)
      setToastParams({
        msg,
        isSuccess: !isFailed,
        isError: isFailed,
      })
      setEditStatus(false)
      setImages([])
    }
  }

  return (
    <div className="page profile">
      <CustomCard width={600} height="fit-content">
        <div className="profile-container">
          <h2>{"Your Profile"}</h2>

          <Grid container spacing={2}>
            <Grid item xs={12}>
              {edit_status ? (
                <div className="avatar-uploader-custom">
                  {!avatar && (
                    <Avatar className="profile-avatar" sx={{ bgcolor: deepOrange[500] }}>
                      {user.username[0].toUpperCase()}
                    </Avatar>
                  )}
                  <AvatarUploader
                    avatar={avatar}
                    setAvatar={setAvatar}
                    images={images}
                    setImages={setImages}
                  />
                </div>
              ) : avatar ? (
                <Avatar className="profile-avatar" alt={user.username} src={avatar} />
              ) : (
                <Avatar className="profile-avatar" sx={{ bgcolor: deepOrange[500] }}>
                  {user.username[0].toUpperCase()}
                </Avatar>
              )}
            </Grid>

            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="username"
                label="Username"
                type="text"
                fullWidth
                variant="outlined"
                value={user.username}
                disabled={true}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="Email"
                type="text"
                fullWidth
                variant="outlined"
                value={user.email}
                disabled={true}
              />
            </Grid>

            <Grid item xs={6}>
              <TextField
                autoFocus
                margin="dense"
                id="isAdmin"
                label="Is Admin"
                type="text"
                fullWidth
                variant="outlined"
                value={user.isAdmin ? "yes" : "no"}
                disabled={true}
              />
            </Grid>

            <Grid item xs={6} className="profile-date-picker">
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
                  disabled={!edit_status}
                />
              </LocalizationProvider>
            </Grid>

            <Grid item xs={12}>
              <Button className="profile-action" variant="outlined" onClick={handleForm}>
                {edit_status ? "Update" : "Edit"}
              </Button>
            </Grid>
          </Grid>
        </div>
      </CustomCard>
    </div>
  )
}

export default observer(Profile)
