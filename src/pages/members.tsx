import React, { useEffect, useState } from "react"
import EnhancedTable from "../components/table/EnhancedTable"
import { MemberParam } from "../models/member"
import ApiClient from "../services/api-client"
import Config from "../config/config"
import { observer } from "mobx-react"
import { otherStore } from "../store"
import _ from "lodash"

const apiClient = ApiClient.getInstance()

const Members = () => {
  const { setLoading, setToastParams } = otherStore
  const [members, setMembers] = useState<MemberParam[]>([])

  useEffect(() => {
    initFetch()
  }, [])

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
