const MongoClient = require("mongodb").MongoClient
const { MONGODB_URL, DB_NAME, COLLECTION_NAME } = require("../constants")

const initialConnectDB = () => {
  MongoClient.connect(MONGODB_URL, function (err, client) {
    if (err) throw err

    const db = client.db(DB_NAME)

    db.listCollections().toArray(function (err, collInfos) {
      if (err) throw err

      if (collInfos && collInfos.length && collInfos[0].name === COLLECTION_NAME) {
        console.log("collection was created already, collection name: ", COLLECTION_NAME)
        client.close()
      } else {
        db.createCollection(COLLECTION_NAME, function (err, res) {
          if (err) throw err
          console.log("Collection created!", res)
          client.close()
        })
      }
    })
  })
}

module.exports = { initialConnectDB }
