const express = require("express")
const cors = require("cors")({ origin: "*" })
const bodyParser = require("body-parser")
const { cloneDeep } = require("lodash")
const MongoClient = require("mongodb").MongoClient
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const { MONGODB_URL, DB_NAME, COLLECTION_NAME } = require("../constants")
const jsonParser = bodyParser.json()

const app = express()
app.use(cors)

const router = express.Router()

// fetch all members list
router.get("/list", (req, res) => {
  try {
    MongoClient.connect(MONGODB_URL, function (err, client) {
      if (err) throw err

      const db = client.db(DB_NAME)

      db.collection(COLLECTION_NAME)
        .find({})
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

// update one member with it's _id
router.put("/update/:id", jsonParser, (req, res) => {
  const data = cloneDeep(req.body),
    _id = req.body._id

  if (!_id) {
    res.status(400).json({
      message: "Some error occured",
      err,
    })
  }

  const dataKeys = Object.keys(data)
  const newSet = {}

  dataKeys.forEach((v) => {
    if (v !== "_id") {
      newSet[v] = data[v]
    }
  })

  try {
    const myquery = { _id: new ObjectId(_id) }
    const newvalues = { $set: newSet }

    MongoClient.connect(MONGODB_URL, function (err, client) {
      if (err) throw err

      const db = client.db(DB_NAME)

      db.collection(COLLECTION_NAME).updateOne(myquery, newvalues, function (error, resp) {
        if (error) throw error
        client.close()
        res.status(200).json({ updated: resp.modifiedCount })
      })
    })
  } catch (e) {
    res.status(400).json({
      message: "Some error occured",
      e,
    })
  }
})

// delete one member with it's _id
router.post("/delete", jsonParser, (req, res) => {
  const ids = req.body.ids

  if (!ids || !ids.length) {
    res.status(400).json({
      message: "Some error occured",
      err,
    })
  }

  const deleteSets = { $in: ids.map((id) => new ObjectId(id)) }

  try {
    MongoClient.connect(MONGODB_URL, function (err, client) {
      if (err) throw err

      const db = client.db(DB_NAME)

      db.collection(COLLECTION_NAME).deleteMany({ _id: deleteSets }, function (error, obj) {
        if (error) throw error
        client.close()
        res.status(200).json({ deleted: obj.deletedCount })
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
