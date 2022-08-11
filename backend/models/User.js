const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema(
  {
    _id: mongoose.Schema.Types.ObjectId,
    username: {
      type: String,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    logged_status: {
      type: Boolean,
    },
    isAdmin: {
      type: Boolean,
    },
    avatar: {
      type: String,
    },
    gender: {
      type: String,
    },
    birthday: {
      type: String,
    },
    phone: {
      type: String,
    },
    career: {
      type: String,
    },
    about: {
      type: String,
    },
  },
  {
    collection: "users",
  }
)
module.exports = mongoose.model("User", userSchema)
