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
import LoginIcon from "@mui/icons-material/Login"
import LogoutIcon from "@mui/icons-material/Logout"
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom"
import { useNavigate } from "react-router-dom"
import { observer } from "mobx-react"
import { store } from "../store"
import logo from "../assets/png/logo.png"

export const unauthorized_routes = [
  {
    name: "Dashboard",
    icon: () => <HomeIcon />,
    link: "/dashboard",
  },
]

export const authorized_routes = [
  {
    name: "Family Tree",
    icon: () => <FamilyRestroomIcon />,
    link: "/family",
  },
]

type Anchor = "top" | "left" | "bottom" | "right"

const Sidebar = () => {
  const { login_status, setLoginStatus } = store
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

  const handleLogout = () => {
    setLoginStatus(false)
    navigate("/login")
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
      </List>
      <Divider />
      {login_status ? (
        <React.Fragment>
          <List>
            {authorized_routes.map((item, index) => (
              <ListItem key={index} disablePadding>
                <ListItemButton onClick={() => handleRoute(item.link)}>
                  <ListItemIcon>{item.icon()}</ListItemIcon>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
        </React.Fragment>
      ) : null}
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
            <p>Family Story</p>
          </div>
          {list(menu_anchor)}
          <div className="sidebar-drawer-footer" onClick={closeDrawer} onKeyDown={closeDrawer}>
            <Divider />
            <List>
              <ListItem disablePadding>
                {!login_status ? (
                  <ListItemButton onClick={() => handleRoute("/login")}>
                    <ListItemIcon>
                      <LoginIcon />
                    </ListItemIcon>
                    <ListItemText primary={"Log In"} />
                  </ListItemButton>
                ) : (
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
