const express = require("express")
const cors = require("cors")({ origin: "*" })
const bodyParser = require("body-parser")
const { cloneDeep, isEmpty } = require("lodash")
const MongoClient = require("mongodb").MongoClient
const mongoose = require("mongoose")
const ObjectId = mongoose.Types.ObjectId
const { MONGODB_URL, DB_NAME, COLLECTION_MEMBERS } = require("../constants")
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

      db.collection(COLLECTION_MEMBERS)
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

      db.collection(COLLECTION_MEMBERS).updateOne(myquery, newvalues, function (error, resp) {
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

      db.collection(COLLECTION_MEMBERS).deleteMany({ _id: deleteSets }, function (error, obj) {
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

// create one member
router.post("/create", jsonParser, (req, res) => {
  const data = req.body.data

  if (!data || isEmpty(data)) {
    res.status(400).json({
      message: "Some error occured",
      err,
    })
  }

  try {
    MongoClient.connect(MONGODB_URL, function (err, client) {
      if (err) throw err

      const db = client.db(DB_NAME)

      db.collection(COLLECTION_MEMBERS).insertOne(data, function (error, obj) {
        if (error) throw error
        client.close()
        res.status(200).json({ insertedId: obj.insertedId })
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
