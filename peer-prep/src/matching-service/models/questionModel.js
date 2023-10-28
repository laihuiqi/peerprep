const mongoose = require('mongoose');

const Schema = mongoose.Schema

const questionSchema = new Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  complexity: String,
  category: String,
  language:{type: String, required: true},
  userTags: [{ userId: String, tags: [String]}],
});

module.exports = mongoose.model('Question', questionSchema);

