const MongoClient = require("mongodb").MongoClient
const { MONGODB_URL, DB_NAME, COLLECTION_MEMBERS } = require("../constants")

process.on("uncaughtException", (err) => {
  console.log("process err", err)
  process.exit(1)
})

const initialConnectMembersDB = async () => {
  try {
    await MongoClient.connect(MONGODB_URL, function (err, client) {
      if (err) throw err

      const db = client.db(DB_NAME)

      db.listCollections().toArray(function (err, collInfos) {
        if (err) throw err

        if (
          collInfos &&
          collInfos.length &&
          collInfos.map((v) => v.name).includes(COLLECTION_MEMBERS)
        ) {
          console.log("collection was created already, collection name: ", COLLECTION_MEMBERS)
          client.close()
        } else {
          db.createCollection(COLLECTION_MEMBERS, function (err, res) {
            if (err) throw err
            console.log("Collection created!", res)
            client.close()
          })
        }
      })
    })
  } catch (err) {
    console.log("Exiting from thrown error", err)
    process.exit(1)
  }
}

module.exports = { initialConnectMembersDB }
