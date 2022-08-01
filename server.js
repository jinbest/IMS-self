const express = require("express")
const cors = require("cors")({ origin: "*" })
const { initialConnectMembersDB } = require("./backend/members/connect-db")
const { initialConnectUsersDB } = require("./backend/users/connect-db")

/* import APIs */
const membersRouter = require("./backend/members/members")
const usersRouter = require("./backend/users/users")

const app = express()
const PORT = 5001

app.use(cors)
app.use("/members", membersRouter)
app.use("/users", usersRouter)
app.get("/", (req, res) => {
  res.send("Hello World")
})

const init = async () => {
  await initialConnectMembersDB()
  await initialConnectUsersDB()
}

init()

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`))
module.exports = app
