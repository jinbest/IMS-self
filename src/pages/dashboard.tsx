import React from "react"
import CustomCard from "../components/CustomCard"
import { observer } from "mobx-react"

const Dashboard = () => {
  return (
    <div className="page dashboard">
      <CustomCard width={1200} height="auto">
        <p>dashboard page</p>
      </CustomCard>
    </div>
  )
}

export default observer(Dashboard)
