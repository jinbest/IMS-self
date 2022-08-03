const express = require("express")
const cors = require("cors")({ origin: "*" })
const Pusher = require("pusher")
const {
  PUSHER_APP_ID,
  PUSHER_APP_KEY,
  PUSHER_APP_SECRET,
  PUSHER_APP_CLUSTER,
  COLLECTION_MEMBERS,
  MONGODB_BASE,
  RS0_PRIMARY_URL,
  RSO_SECONDARY_URL,
  DB_NAME,
  TRIGER_MEMBER_INSERTED,
  TRIGER_MEMBER_DELETED,
  TRIGER_MEMBER_UPDATED,
} = require("./backend/constants")
const MongoClient = require("mongodb").MongoClient

const { initialConnectMembersDB } = require("./backend/members/connect-db")
const { initialConnectUsersDB } = require("./backend/users/connect-db")

/* import APIs */
const membersRouter = require("./backend/members/members")
const usersRouter = require("./backend/users/users")

const pusher = new Pusher({
  appId: PUSHER_APP_ID,
  key: PUSHER_APP_KEY,
  secret: PUSHER_APP_SECRET,
  cluster: PUSHER_APP_CLUSTER,
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
      const memberChangeStream = memberCollection.watch()

      memberChangeStream.on("change", (change) => {
        // console.log("memberChangeStream", change)

        if (change.operationType === "insert") {
          pusher.trigger(channel, TRIGER_MEMBER_INSERTED, change.fullDocument)
        } else if (change.operationType === "delete") {
          pusher.trigger(channel, TRIGER_MEMBER_DELETED, change.documentKey._id)
        } else if (change.operationType === "update") {
          pusher.trigger(channel, TRIGER_MEMBER_UPDATED, {
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
