const express = require("express")
const app = express()
const bodyParser = require("body-parser")
const cors = require("cors")({ origin: "*" })
// const Pusher = require("pusher")
const { Server } = require("socket.io")
const {
  // PUSHER_APP_ID,
  // PUSHER_APP_KEY,
  // PUSHER_APP_SECRET,
  // PUSHER_APP_CLUSTER,
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
const http = require("http")
const server = http.createServer(app)
const io = new Server(server, {
  cors: "*",
  method: ["GET", "POST", "PUT"],
})
const PORT = 5001

const { initialConnectMembersDB } = require("./backend/members/connect-db")
const { initialConnectUsersDB } = require("./backend/users/connect-db")

/* import APIs */
const membersRouter = require("./backend/members/members")
const usersRouter = require("./backend/users/users")

// const pusher = new Pusher({
//   appId: PUSHER_APP_ID,
//   key: PUSHER_APP_KEY,
//   secret: PUSHER_APP_SECRET,
//   cluster: PUSHER_APP_CLUSTER,
//   useTLS: true,
// })
// const channel = COLLECTION_MEMBERS

app.use(cors)

app.use("/members", membersRouter)
app.use("/users", usersRouter)

app.use(bodyParser.json()) // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
)
app.use("/uploads", express.static("uploads"))

app.use((req, res, next) => {
  // Error goes via `next()` method
  // setImmediate(() => {
  //   next(new Error("Something went wrong"))
  // })

  res.header("Access-Control-Allow-Origin", "*")
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept")
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
  next()
})

app.use(function (err, req, res, next) {
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.message)
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
          // pusher.trigger(channel, TRIGER_MEMBER_INSERTED, change.fullDocument)
          io.sockets.emit(TRIGER_MEMBER_INSERTED, change.fullDocument)
        } else if (change.operationType === "delete") {
          // pusher.trigger(channel, TRIGER_MEMBER_DELETED, change.documentKey._id)
          io.sockets.emit(TRIGER_MEMBER_DELETED, change.documentKey._id)
        } else if (change.operationType === "update") {
          // pusher.trigger(channel, TRIGER_MEMBER_UPDATED, {
          //   id: change.documentKey._id,
          //   updatedFields: change.updateDescription.updatedFields,
          // })
          io.sockets.emit(TRIGER_MEMBER_UPDATED, {
            id: change.documentKey._id,
            updatedFields: change.updateDescription.updatedFields,
          })
        }
      })
    }
  )
}

init()

server.listen(PORT, () => console.log(`Server listening at port ${PORT}`))
module.exports = app
