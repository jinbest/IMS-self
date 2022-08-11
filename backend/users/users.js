const express = require("express")
const bodyParser = require("body-parser")
const { cloneDeep } = require("lodash")
const MongoClient = require("mongodb").MongoClient
const { MONGODB_URL, DB_NAME, COLLECTION_USERS } = require("../constants")
const jsonParser = bodyParser.json()
const bcrypt = require("bcrypt")
const multer = require("multer")

const router = express.Router()

const UPLOAD_DIR = "/uploads/"

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `.${UPLOAD_DIR}`)
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-")
    cb(null, new Date().getTime() + "-" + fileName)
  },
})

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg"
    ) {
      cb(null, true)
    } else {
      cb(null, false)
      return cb(new Error("Only .png, .jpg and .jpeg format allowed!"))
    }
  },
})

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

  const salt = bcrypt.genSaltSync(10)
  const hashPassword = bcrypt.hashSync(password, salt)

  const isAdmin = username === "jinbest" ? true : false

  const newUser = {
    username,
    email,
    password: hashPassword,
    logged_status: true,
    isAdmin,
    avatar: "",
    gender: "M",
    birthday: "2000-01-01",
    phone: "",
    career: "",
    about: "",
  }

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
        // .find(query, { projection: { _id: 0, username: 1, password: 1, isAdmin: 1, email: 1 } })
        .find(query, {})
        .toArray(function (error, result) {
          if (error) throw error

          if (!result || !result.length) {
            res.status(200).json({
              success: false,
              message: "This username does not have an account.",
            })
            client.close()
          } else {
            const user = result[0]
            const isSame = bcrypt.compareSync(password, user.password)

            if (isSame) {
              const newset = { $set: { logged_status: true } }

              db.collection(COLLECTION_USERS).updateOne(
                query,
                newset,
                function (err_update, res_update) {
                  if (err_update) throw err_update
                  console.log(`logged_status set as true for ${username}`, res_update)

                  res.status(200).json({
                    success: true,
                    isAdmin: user?.isAdmin,
                    email: user?.email,
                    avatar: user?.avatar,
                    phone: user?.phone,
                    address: user?.address,
                    career: user?.career,
                    about: user?.about,
                    birthday: user?.birthday,
                    gender: user?.gender,
                  })
                  client.close()
                }
              )
            } else {
              res.status(200).json({
                success: false,
                message: "Password is not correct.",
              })
              client.close()
            }
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

/* With file uploader */
router.post("/update/:username", upload.single("profileImg"), (req, res, next) => {
  const { username, birthday } = req.body

  const url = req.protocol + "://" + req.get("host")
  const avatar_url = url + UPLOAD_DIR + req.file.filename

  try {
    const query = { username }

    MongoClient.connect(MONGODB_URL, function (err, client) {
      if (err) throw err

      const db = client.db(DB_NAME)

      const newset = { $set: { birthday, avatar: avatar_url } }

      db.collection(COLLECTION_USERS).updateMany(query, newset, function (err_update, res_update) {
        if (err_update) throw err_update
        console.log(`${username}'s data updated`, res_update)

        res.status(200).json({
          success: true,
          avatar: avatar_url,
        })
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

module.exports = router
