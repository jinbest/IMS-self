const MongoClient = require("mongodb").MongoClient
const { ObjectId } = require("mongodb")
const {
  MONGODB_URL: url,
  DB_NAME: dbName,
  COLLECTION_NAME: collectionName,
} = require("./constants")

MongoClient.connect(url, function (err, client) {
  if (err) throw err

  const db = client.db(dbName)

  /* ----- 1. db collection create ----- */
  // db.createCollection(collectionName, function (err, res) {
  //   if (err) throw err
  //   console.log("Collection created!")
  //   client.close()
  // })
  /* ------------------------------------------------------------------- */

  /* ----- 2. db collection: insertOne document ----- */
  // const myobj = { fullname: "Jin Zheng", email: "jinzh718@gmail.com" }
  // db.collection(collectionName).insertOne(myobj, function (err, res) {
  //   if (err) throw err
  //   console.log("1 document inserted")
  //   client.close()
  // })
  /* ------------------------------------------------------------------- */

  /* ----- 3. db collection: insertMany documents ----- */
  const manyObjs = [
    {
      fullname: "Jin Zheng",
      email: "jin@thetrackapp.com",
      gender: "M",
      birthday: "1994-07-18",
      job: "developer",
      address: "test address1",
    },
    {
      fullname: "Shixiong Han",
      email: "shixiong@thetrackapp.com",
      gender: "M",
      birthday: "1996-01-15",
      job: "web-developer",
      address: "test address2",
    },
    {
      fullname: "Xiaoping Jin",
      email: "jeff@thetrackapp.com",
      gender: "M",
      birthday: "1995-02-10",
      job: "web-developer",
      address: "test address3",
    },
  ]
  db.collection(collectionName).insertMany(manyObjs, function (err, res) {
    if (err) throw err
    console.log("Number of documents inserted: " + res.insertedCount, res)
    client.close()
  })
  /* ------------------------------------------------------------------- */

  /* ----- 4. db collection: findOne & findAll & find projection ----- */
  // db.collection(collectionName).findOne({}, function (err, result) {
  //   if (err) throw err
  //   console.log("result.fullname", result.fullname)
  //   client.close()
  // })

  // db.collection(collectionName)
  //   .find({})
  //   .toArray(function (err, result) {
  //     if (err) throw err
  //     console.log("result", result)
  //     client.close()
  //   })

  // db.collection(collectionName)
  //   .find({}, { projection: { _id: 0, email: 1, fullname: 1 } })
  //   .toArray(function (err, result) {
  //     if (err) throw err
  //     console.log("result", result)
  //     client.close()
  //   })
  /* ------------------------------------------------------------------- */

  /* ----- 5. db collection: query ----- */
  // const query = { email: "jinzh718@gmail.com" }
  // const query = { _id: new ObjectId("62e6cbc59de167e61d08f152") }
  // db.collection(collectionName)
  //   // .find(query)
  //   .find(query, { projection: { _id: 0, email: 1, fullname: 1 } })
  //   .toArray(function (err, result) {
  //     if (err) throw err
  //     console.log("result", result)
  //     client.close()
  //   })
  /* ------------------------------------------------------------------- */

  /* ----- 6. db collection: sort ----- */
  // const mysort = { fullname: 1 }
  // db.collection(collectionName)
  //   // .find()
  //   .find({}, { projection: { _id: 0, email: 1, fullname: 1 } })
  //   .sort(mysort)
  //   .toArray(function (err, result) {
  //     if (err) throw err
  //     console.log("result", result)
  //     client.close()
  //   })
  /* ------------------------------------------------------------------- */

  /* ----- 7. db collection: delete ----- */
  // const myquery = { fullname: "Jin Zheng" }
  // db.collection(collectionName).deleteOne(myquery, function (err, obj) {
  //   if (err) throw err
  //   console.log("1 document deleted")
  //   client.close()
  // })
  /* ------------------------------------------------------------------- */

  /* ----- 8. db collection: update ----- */
  // const myquery = { email: "jin@thetrackapp.com" }
  // const newvalues = { $set: { fullname: "Jin Zh" } }
  // db.collection(collectionName).updateOne(myquery, newvalues, function (err, res) {
  //   if (err) throw err
  //   console.log("1 document updated", res)
  //   client.close()
  // })

  // db.collection(collectionName).updateMany(myquery, newvalues, function (err, res) {
  //   if (err) throw err
  //   console.log(res, " document(s) updated")
  //   client.close()
  // })
  /* ------------------------------------------------------------------- */

  /* ----- 9. db collection: limit ----- */
  // db.collection(collectionName)
  //   // .find()
  //   .find({}, { projection: { _id: 0, email: 1, fullname: 1 } })
  //   .limit(2)
  //   .toArray(function (err, result) {
  //     if (err) throw err
  //     console.log("result", result)
  //     client.close()
  //   })
  /* ------------------------------------------------------------------- */

  /* ----- 10. db collection: drop (delete collection) ----- */
  // db.collection(collectionName).drop(function (err, delOK) {
  //   if (err) throw err
  //   if (delOK) console.log("Collection deleted")
  //   client.close()
  // })

  // db.dropCollection(collectionName, function (err, delOK) {
  //   if (err) throw err
  //   if (delOK) console.log("Collection deleted")
  //   client.close()
  // })
  /* ------------------------------------------------------------------- */

  /* ----- 11. db collection: join ----- */
  /* Join the matching "products" collection document(s) to the "orders" collection: */

  /*
  orders:
  [
    { _id: 1, product_id: 154, status: 1 }
  ]

  products:
  [
    { _id: 154, name: 'Chocolate Heaven' },
    { _id: 155, name: 'Tasty Lemons' },
    { _id: 156, name: 'Vanilla Dreams' }
  ]

  result:
  [
    { "_id": 1, "product_id": 154, "status": 1, "orderdetails": [
      { "_id": 154, "name": "Chocolate Heaven" } ]
    }
  ]  
  */

  // db.collection("orders")
  //   .aggregate([
  //     {
  //       $lookup: {
  //         from: "products",
  //         localField: "product_id",
  //         foreignField: "_id",
  //         as: "orderdetails",
  //       },
  //     },
  //   ])
  //   .toArray(function (err, res) {
  //     if (err) throw err
  //     console.log(JSON.stringify(res))
  //     client.close()
  //   })
  /* ------------------------------------------------------------------- */

  /* ----- 12. Listing all collections ----- */
  // db.listCollections().toArray(function (err, collInfos) {
  //   if (err) throw err

  //   console.log("collInfos", collInfos, collInfos[0].name)
  //   client.close()
  // })
  /* ------------------------------------------------------------------- */

  /* db collections status checking and create */
  // db.listCollections().toArray(function (err, collInfos) {
  //   if (err) throw err

  //   if (collInfos && collInfos.length && collInfos[0].name === collectionName) {
  //     console.log("collection was created already, collection name: ", collectionName)
  //     client.close()
  //   } else {
  //     db.createCollection(collectionName, function (err, res) {
  //       if (err) throw err
  //       console.log("Collection created!", res)
  //       client.close()
  //     })
  //   }
  // })
  /* ------------------------------------------------------------------- */
})
