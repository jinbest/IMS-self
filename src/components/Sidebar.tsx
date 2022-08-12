import * as React from "react"
import Box from "@mui/material/Box"
import Drawer from "@mui/material/Drawer"
import Button from "@mui/material/Button"
import List from "@mui/material/List"
import Divider from "@mui/material/Divider"
import ListItem from "@mui/material/ListItem"
import ListItemButton from "@mui/material/ListItemButton"
import ListItemIcon from "@mui/material/ListItemIcon"
import ListItemText from "@mui/material/ListItemText"
import MenuIcon from "@mui/icons-material/Menu"
import CloseIcon from "@mui/icons-material/Close"
import HomeIcon from "@mui/icons-material/Home"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import LoginIcon from "@mui/icons-material/Login"
import LogoutIcon from "@mui/icons-material/Logout"
import PeopleAltIcon from "@mui/icons-material/PeopleAlt"
import ChatIcon from "@mui/icons-material/Chat"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react"
import { store, otherStore } from "../store"
import logo from "../assets/png/ims_logo2.png"
import { UserParam } from "../models/user"
import ApiClient from "../services/api-client"
import Config from "../config/config"

const apiClient = ApiClient.getInstance()

export const unauthorized_routes = [
  {
    name: "Dashboard",
    icon: () => <HomeIcon />,
    link: "/dashboard",
  },
]

export const authorized_routes = [
  {
    name: "Members",
    icon: () => <PeopleAltIcon />,
    link: "/members",
  },
  {
    name: "Profile",
    icon: () => <AccountCircleIcon />,
    link: "/profile",
  },
  {
    name: "Chats",
    icon: () => <ChatIcon />,
    link: "/chats",
  },
]

type Anchor = "top" | "left" | "bottom" | "right"

const Sidebar = () => {
  const { login_status, setLoginStatus, setUser, user } = store
  const { setLoading, setToastParams } = otherStore

  const menu_anchor = "left" as Anchor

  const navigate = useNavigate()

  const [open_drawer, setOpenDrawer] = React.useState(false)

  const closeDrawer = () => {
    setOpenDrawer(false)
  }

  const openDrawer = () => {
    setOpenDrawer(true)
  }

  const handleRoute = (link: string) => {
    navigate(link)
  }

  const handleLogout = async () => {
    let msg = "You've been logged out",
      isFailed = false

    setLoading(true)
    try {
      const results = await apiClient.post<{ success: boolean }>(
        `${Config.BASE_URL}/users/logout`,
        { username: user.username }
      )
      if (results.success) {
        setLoading(false)
        setLoginStatus(false)
        setUser({} as UserParam)
        navigate("/auth")
      } else {
        msg = "Something went wrong while logging out."
        isFailed = true
      }
    } catch (e) {
      console.log("Something went wrong", e)
      msg = "Something went wrong while logging out."
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

  const list = (anchor: Anchor) => (
    <Box
      sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
      role="presentation"
      onClick={closeDrawer}
      onKeyDown={closeDrawer}
    >
      <Divider />
      <List>
        {unauthorized_routes.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton onClick={() => handleRoute(item.link)}>
              <ListItemIcon>{item.icon()}</ListItemIcon>
              <ListItemText primary={item.name} />
            </ListItemButton>
          </ListItem>
        ))}
        {login_status ? (
          <React.Fragment>
            {authorized_routes.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleRoute(item.link)}>
                  <ListItemIcon>{item.icon()}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </React.Fragment>
        ) : null}
      </List>
      {/* <Divider /> */}
    </Box>
  )

  return (
    <div className="sidebar">
      <Button onClick={openDrawer}>
        {open_drawer ? <CloseIcon sx={{ color: "white" }} /> : <MenuIcon sx={{ color: "white" }} />}
      </Button>
      <Drawer anchor={menu_anchor} open={open_drawer} onClose={closeDrawer}>
        <div className="sidebar-drawer">
          <div className="sidebar-drawer-header">
            <img src={logo} alt="logo" />
          </div>
          {list(menu_anchor)}
          <div className="sidebar-drawer-footer" onClick={closeDrawer} onKeyDown={closeDrawer}>
            <Divider />
            <List>
              <ListItem disablePadding>
                {!login_status ? (
                  <ListItemButton onClick={() => handleRoute("/auth")}>
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Log In"} />
                  </ListItemButton>
                ) : (
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  <ListItemButton onClick={handleLogout}>
                    <ListItemIcon>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Log Out"} />
                  </ListItemButton>
                )}
              </ListItem>
            </List>
            <Divider />
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default observer(Sidebar)
