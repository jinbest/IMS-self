import React, { useEffect, useState, useRef } from "react"
import EnhancedTable from "../components/table/EnhancedTable"
import { MemberParam } from "../models/member"
import ApiClient from "../services/api-client"
import Config from "../config/config"
import { observer } from "mobx-react"
import { otherStore } from "../store"
import _, { isEmpty } from "lodash"
import Pusher from "pusher-js"
import {
  COLLECTION_MEMBERS,
  PUSHER_APP_KEY,
  PUSHER_APP_CLUSTER,
  TRIGER_MEMBER_INSERTED,
  TRIGER_MEMBER_DELETED,
  TRIGER_MEMBER_UPDATED,
} from "../constants/app-const"

const apiClient = ApiClient.getInstance()

const Members = () => {
  const { setLoading, setToastParams } = otherStore
  const membersRef = useRef<MemberParam[]>([])

  const [members, setMembers] = useState<MemberParam[]>([])

  const setUpdateMembers = (data: MemberParam[]) => {
    setMembers([...data])
    membersRef.current = _.cloneDeep(data)
  }

  useEffect(() => {
    initFetch()
  }, [])

  useEffect(() => {
    const pusher = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER,
      // encrypted: true,
    })
    const channel_members = pusher.subscribe(COLLECTION_MEMBERS)

    channel_members.bind(TRIGER_MEMBER_INSERTED, insertedMember)
    channel_members.bind(TRIGER_MEMBER_DELETED, removedMember)
    channel_members.bind(TRIGER_MEMBER_UPDATED, updatedMember)

    return () => {
      channel_members.unbind(TRIGER_MEMBER_INSERTED)
      channel_members.unbind(TRIGER_MEMBER_DELETED)
      channel_members.unbind(TRIGER_MEMBER_UPDATED)
    }
  }, [])

  const insertedMember = (data: MemberParam) => {
    const cntMembers = _.cloneDeep(membersRef.current)
    const dataIndex = _.findIndex(cntMembers, (o) => o._id === data._id)
    if (dataIndex === -1) {
      cntMembers.push(data)
      setUpdateMembers([...cntMembers])
    }
  }

  const updatedMember = (data: any) => {
    const cntMembers = _.cloneDeep(membersRef.current)
    const updateIndex = _.findIndex(cntMembers, (o) => o._id === data.id)
    if (updateIndex > -1 && data.updatedFields && !isEmpty(data.updatedFields)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const keys = Object.keys(data.updatedFields)
      keys.forEach((key) => {
        switch (key) {
          case "fullname":
            cntMembers[updateIndex]["fullname"] = data.updatedFields[key]
            break
          case "email":
            cntMembers[updateIndex]["email"] = data.updatedFields[key]
            break
          case "gender":
            cntMembers[updateIndex]["gender"] = data.updatedFields[key]
            break
          case "birthday":
            cntMembers[updateIndex]["birthday"] = data.updatedFields[key]
            break
          case "job":
            cntMembers[updateIndex]["job"] = data.updatedFields[key]
            break
          case "address":
            cntMembers[updateIndex]["address"] = data.updatedFields[key]
            break
        }
      })
      setUpdateMembers([...cntMembers])
    }
  }

  const removedMember = (id: string) => {
    const cntMembers = _.cloneDeep(membersRef.current)
    const removeIndex = _.findIndex(cntMembers, (o) => o._id === id)
    if (removeIndex > -1) {
      cntMembers.splice(removeIndex, 1)
      setUpdateMembers([...cntMembers])
    }
  }

  const initFetch = async () => {
    setLoading(true)

    try {
      const results = await apiClient.get<MemberParam[]>(`${Config.BASE_URL}/members/list`)
      setUpdateMembers(_.cloneDeep(results))
    } catch (e) {
      console.log("Something went wrong", e)
      setToastParams({
        msg: "Something went wrong to fetch initial members list",
        isError: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page members">
      <div className="members-container">
        <EnhancedTable rows={members} setRows={setUpdateMembers} />
      </div>
    </div>
  )
}

export default observer(Members)
