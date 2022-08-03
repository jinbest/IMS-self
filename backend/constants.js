const MONGODB_BASE = "mongodb"
const RS0_PRIMARY_URL = "127.0.0.1:27017"
const RSO_SECONDARY_URL = "127.0.0.1:27018"
const MONGODB_URL = "mongodb://127.0.0.1:27017/"
const DB_NAME = "MyDb"
const COLLECTION_MEMBERS = "members"
const COLLECTION_USERS = "users"

/**
 * https://dashboard.pusher.com/apps/1456883/keys
 * app_id = "1456883"
 * key = "982c58a5151b8ec8565c"
 * secret = "3024e38dbc3a1a8a1cbf"
 * cluster = "ap4"
 */
const INSERT_APP_ID = "1456883"
const INSERT_APP_KEY = "982c58a5151b8ec8565c"
const INSERT_APP_SECRET = "3024e38dbc3a1a8a1cbf"
const INSERT_APP_CLUSTER = "ap4"

module.exports = {
  MONGODB_BASE,
  MONGODB_URL,
  RS0_PRIMARY_URL,
  RSO_SECONDARY_URL,
  DB_NAME,
  COLLECTION_MEMBERS,
  COLLECTION_USERS,
  INSERT_APP_ID,
  INSERT_APP_KEY,
  INSERT_APP_SECRET,
  INSERT_APP_CLUSTER,
}
