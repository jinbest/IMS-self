import React, { useState, useEffect } from "react"
import CustomCard from "../components/CustomCard"
import { observer } from "mobx-react"
import { otherStore } from "../store"
import ApiClient from "../services/api-client"
import Config from "../config/config"
import { UserParam } from "../models/user"
import UserChat from "../components/UserChat"

const apiClient = ApiClient.getInstance()

const Chats = () => {
  const { setLoading, setToastParams } = otherStore

  const [users, setUsers] = useState<UserParam[]>([])

  useEffect(() => {
    initFetch()
  }, [])

  const initFetch = async () => {
    setLoading(true)

    try {
      const results = await apiClient.get<UserParam[]>(`${Config.BASE_URL}/users/list`)
      setUsers([...results])
    } catch (e) {
      console.log("Something went wrong", e)
      setToastParams({
        msg: "Something went wrong to fetch initial users list",
        isError: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page chats">
      <CustomCard width={1200} height="fit-content" minHeight={600}>
        <div className="chats-container">
          <h2>{"Chats"}</h2>
          <UserChat users={users} />
        </div>
      </CustomCard>
    </div>
  )
}

export default observer(Chats)
