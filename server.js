const express = require("express")
const cors = require("cors")({ origin: "*" })
const { initialConnectDB } = require("./backend/members/connect-db")

/* import APIs */
const membersRouter = require("./backend/members/members")

const app = express()
const PORT = 5001

app.use(cors)
app.use("/members", membersRouter)
app.get("/", (req, res) => {
  res.send("Hello World")
})

const init = () => {
  initialConnectDB()
}

init()

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`))
module.exports = app
