const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: String,
  name: String,
  email: String,
  githubId: String,
  preferredLanguage: String,
  isAdmin: Boolean,
});

module.exports = mongoose.model("User", userSchema);
