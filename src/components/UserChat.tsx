import React from "react"
import { UserParam } from "../models/user"

interface UserChatProps {
  users: UserParam[]
}

const UserChat = ({ users }: UserChatProps) => {
  console.log("users-chat", users)

  return <div className="users-chat">{"user's chat"}</div>
}

export default UserChat
