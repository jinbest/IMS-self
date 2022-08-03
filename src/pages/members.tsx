import React, { useEffect, useState } from "react"
import EnhancedTable from "../components/table/EnhancedTable"
import { MemberParam } from "../models/member"
import ApiClient from "../services/api-client"
import Config from "../config/config"
import { observer } from "mobx-react"
import { otherStore } from "../store"
import _, { isEmpty } from "lodash"
import Pusher from "pusher-js"

const apiClient = ApiClient.getInstance()
const { PUSHER_APP_KEY, PUSHER_APP_CLUSTER } = Config

const Members = () => {
  const { setLoading, setToastParams } = otherStore
  const [members, setMembers] = useState<MemberParam[]>([])

  useEffect(() => {
    initFetch()
  }, [])

  useEffect(() => {
    initPusherSubscribe()
  }, [members])

  const insertedMember = (data: MemberParam) => {
    const dataIndex = _.findIndex(members, (o) => o._id === data._id)
    if (dataIndex === -1) {
      members.push(data)
      setMembers([...members])
    }
  }

  const updatedMember = (data: any) => {
    const updateIndex = _.findIndex(members, (o) => o._id === data.id)
    if (updateIndex > -1 && data.updatedFields && !isEmpty(data.updatedFields)) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const keys = Object.keys(data.updatedFields)
      keys.forEach((key) => {
        switch (key) {
          case "fullname":
            members[updateIndex]["fullname"] = data.updatedFields[key]
            break
          case "email":
            members[updateIndex]["email"] = data.updatedFields[key]
            break
          case "gender":
            members[updateIndex]["gender"] = data.updatedFields[key]
            break
          case "birthday":
            members[updateIndex]["birthday"] = data.updatedFields[key]
            break
          case "job":
            members[updateIndex]["job"] = data.updatedFields[key]
            break
          case "address":
            members[updateIndex]["address"] = data.updatedFields[key]
            break
        }
      })
      setMembers([...members])
    }
  }

  const removedMember = (id: string) => {
    const removeIndex = _.findIndex(members, (o) => o._id === id)
    if (removeIndex > -1) {
      members.splice(removeIndex, 1)
      setMembers([...members])
    }
  }

  const initPusherSubscribe = () => {
    const pusher = new Pusher(PUSHER_APP_KEY, {
      cluster: PUSHER_APP_CLUSTER,
      // encrypted: true,
    })
    const channel = pusher.subscribe("members")

    channel.bind("inserted", insertedMember)
    channel.bind("deleted", removedMember)
    channel.bind("updated", updatedMember)
  }

  const initFetch = async () => {
    setLoading(true)

    try {
      const results = await apiClient.get<MemberParam[]>(`${Config.BASE_URL}/members/list`)
      setMembers(_.cloneDeep(results))
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
        <EnhancedTable member_rows={members} />
      </div>
    </div>
  )
}

export default observer(Members)
