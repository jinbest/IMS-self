const express = require("express")
const cors = require("cors")({ origin: "*" })
const MongoClient = require("mongodb").MongoClient
const { MONGODB_URL, DB_NAME, COLLECTION_NAME } = require("../constants")

const app = express()
app.use(cors)

const router = express.Router()

router.get("/list", (req, res) => {
  try {
    MongoClient.connect(MONGODB_URL, function (err, client) {
      if (err) throw err

      const db = client.db(DB_NAME)

      db.collection(COLLECTION_NAME)
        .find({})
        .toArray(function (err, result) {
          if (err) throw err
          client.close()
          res.status(200).json(result)
        })
    })
  } catch (err) {
    res.status(400).json({
      message: "Some error occured",
      err,
    })
  }
})

module.exports = router
