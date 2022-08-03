const express = require("express")
const cors = require("cors")({ origin: "*" })
const Pusher = require("pusher")
const {
  INSERT_APP_ID,
  INSERT_APP_KEY,
  INSERT_APP_SECRET,
  INSERT_APP_CLUSTER,
  COLLECTION_MEMBERS,
  MONGODB_BASE,
  RS0_PRIMARY_URL,
  RSO_SECONDARY_URL,
  DB_NAME,
} = require("./backend/constants")
const MongoClient = require("mongodb").MongoClient

const { initialConnectMembersDB } = require("./backend/members/connect-db")
const { initialConnectUsersDB } = require("./backend/users/connect-db")

/* import APIs */
const membersRouter = require("./backend/members/members")
const usersRouter = require("./backend/users/users")

const pusher = new Pusher({
  appId: INSERT_APP_ID,
  key: INSERT_APP_KEY,
  secret: INSERT_APP_SECRET,
  cluster: INSERT_APP_CLUSTER,
  encrypted: true,
})
const channel = COLLECTION_MEMBERS

const app = express()
const PORT = 5001

app.use(cors)

app.use("/members", membersRouter)
app.use("/users", usersRouter)

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  next()
})

app.get("/", (req, res) => {
  res.send("Hello World")
})

const init = async () => {
  await initialConnectMembersDB()
  await initialConnectUsersDB()

  await MongoClient.connect(
    `${MONGODB_BASE}://${RS0_PRIMARY_URL},${RSO_SECONDARY_URL}/?replicaSet=rs0`,
    function (err, client) {
      if (err) throw err

      const db = client.db(DB_NAME)
      const memberCollection = db.collection(COLLECTION_MEMBERS)
      const changeStream = memberCollection.watch()

      changeStream.on("change", (change) => {
        // console.log("changeStream", change)

        if (change.operationType === "insert") {
          pusher.trigger(channel, "inserted", change.fullDocument)
        } else if (change.operationType === "delete") {
          pusher.trigger(channel, "deleted", change.documentKey._id)
        } else if (change.operationType === "update") {
          pusher.trigger(channel, "updated", {
            id: change.documentKey._id,
            updatedFields: change.updateDescription.updatedFields,
          })
        }
      })
    }
  )
}

init()

app.listen(PORT, () => console.log(`Server listening at port ${PORT}`))
module.exports = app
