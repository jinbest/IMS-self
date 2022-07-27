import * as React from "react"
import Card from "@mui/material/Card"
import CardContent from "@mui/material/CardContent"

interface CustomCardProps {
  children?: JSX.Element
  width: number | string
  height: number | string
}

const CustomCard = ({ children, width, height }: CustomCardProps) => {
  return (
    <Card
      sx={{
        width: width,
        maxWidth: "calc(100% - 50px)",
        minWidth: 275,
        height: height,
        maxHeight: "calc(100vh - 100px)",
        minHeight: 275,
        background: "rgba(36, 37, 41, 0.7)",
        border: "1px solid #2b2c31",
        borderRadius: "8px",
      }}
    >
      <CardContent>{children}</CardContent>
    </Card>
  )
}

export default CustomCard
