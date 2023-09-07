import { UserParam } from "./user"

export interface MessageParam {
  creator: UserParam
  created: number
  isModified: boolean
  modified: number
  receiver: UserParam
  text: string
  image: string | null
  isRead: boolean
}

export interface ChatParam {
  _id: string
  users: string[]
  messages: MessageParam[]
}
