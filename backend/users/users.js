const express = require("express")
const cors = require("cors")({ origin: "*" })
const bodyParser = require("body-parser")
const Resize = require("../utils/resize")
const { cloneDeep } = require("lodash")
const MongoClient = require("mongodb").MongoClient
const { MONGODB_URL, DB_NAME, COLLECTION_USERS } = require("../constants")
const jsonParser = bodyParser.json()
const bcrypt = require("bcrypt")
const fileUpload = require("express-fileupload")
const path = require("path")

const salt = bcrypt.genSaltSync(10)

const app = express()
app.use(cors)

const router = express.Router()

router.use(jsonParser)
router.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
router.use(fileUpload())

// fetch all users list
router.get("/list", (req, res) => {
  try {
    MongoClient.connect(MONGODB_URL, function (err, client) {
      if (err) throw err

      const db = client.db(DB_NAME)

      db.collection(COLLECTION_USERS)
        .find(
          {},
          { projection: { _id: 0, email: 1, username: 1, isAdmin: 1, logged_status: 1, avatar: 1 } }
        )
        .toArray(function (error, result) {
          if (error) throw error
          client.close()
          res.status(200).json(result)
        })
    })
  } catch (e) {
    res.status(400).json({
      message: "Some error occured",
      e,
    })
  }
})

router.post("/register", jsonParser, (req, res) => {
  const data = cloneDeep(req.body)
  const { username, email, password } = data
  const hashPassword = bcrypt.hashSync(password, salt)

  const isAdmin = username === "jinbest" ? true : false
  const newUser = { username, email, password: hashPassword, logged_status: true, isAdmin }

  try {
    const query = { username }

    MongoClient.connect(MONGODB_URL, function (err, client) {
      if (err) throw err

      const db = client.db(DB_NAME)

      db.collection(COLLECTION_USERS)
        .find(query)
        .toArray(function (error, result) {
          if (error) throw error

          if (result && result.length) {
            res.status(200).json({
              success: false,
              message: "This username has been registered already.",
            })
            client.close()
          } else {
            db.collection(COLLECTION_USERS).insertOne(newUser, function (insert_err, obj) {
              if (insert_err) throw insert_err
              res.status(200).json({
                success: true,
                isAdmin,
                insertedId: obj.insertedId,
              })
              client.close()
            })
          }
        })
    })
  } catch (e) {
    res.status(400).json({
      message: "Some error occured",
      e,
    })
  }
})

router.post("/login", jsonParser, (req, res) => {
  const data = cloneDeep(req.body)
  const { username, password } = data

  try {
    const query = { username }

    MongoClient.connect(MONGODB_URL, function (err, client) {
      if (err) throw err

      const db = client.db(DB_NAME)

      db.collection(COLLECTION_USERS)
        .find(query, { projection: { _id: 0, username: 1, password: 1, isAdmin: 1, email: 1 } })
        .toArray(function (error, result) {
          if (error) throw error

          if (!result || !result.length) {
            res.status(200).json({
              success: false,
              message: "This username does not have an account.",
            })
          } else {
            const user = result[0]
            const isSame = bcrypt.compareSync(password, user.password)
            if (isSame) {
              res.status(200).json({
                success: true,
                isAdmin: user?.isAdmin,
                email: user?.email,
              })
            } else {
              res.status(200).json({
                success: false,
                message: "Password is not correct.",
              })
            }
          }
          client.close()
        })
    })
  } catch (e) {
    res.status(400).json({
      message: "Some error occured",
      e,
    })
  }
})

router.post("/update/:username", async function (req, res) {
  const imagePath = path.join(__dirname, "/public/")
  const fileUpload = new Resize(imagePath)
  console.log(req.body.content, "image data")

  if (!req.body.content) {
    res.status(401).json({ error: "Please provide an image" })
  }

  const filename = await fileUpload.save(req.body.content.buffer)
  return res.status(200).json({ name: filename })
})

// router.post("/update/:username", (req, res) => {
//   let data = req.body

//   console.log("data", data, data.content)

//   res.status(200).json({
//     success: true,
//   })
// })

module.exports = router
