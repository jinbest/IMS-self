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
const PUSHER_APP_ID = "1456883"
const PUSHER_APP_KEY = "982c58a5151b8ec8565c"
const PUSHER_APP_SECRET = "3024e38dbc3a1a8a1cbf"
const PUSHER_APP_CLUSTER = "ap4"

const TRIGER_MEMBER_INSERTED = "member_inserted"
const TRIGER_MEMBER_DELETED = "member_deleted"
const TRIGER_MEMBER_UPDATED = "member_updated"

module.exports = {
  MONGODB_BASE,
  MONGODB_URL,
  RS0_PRIMARY_URL,
  RSO_SECONDARY_URL,
  DB_NAME,
  COLLECTION_MEMBERS,
  COLLECTION_USERS,
  PUSHER_APP_ID,
  PUSHER_APP_KEY,
  PUSHER_APP_SECRET,
  PUSHER_APP_CLUSTER,
  TRIGER_MEMBER_INSERTED,
  TRIGER_MEMBER_DELETED,
  TRIGER_MEMBER_UPDATED,
}
