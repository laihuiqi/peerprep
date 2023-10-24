const mongoose = require('mongoose');

const Schema = mongoose.Schema

const questionSchema = new Schema({
  title: String,
  description: String,
  complexity: String,
  category: String,
  topic: {type: String, required: true},
  language:{type: String, required: true},
  userTags: [{ userId: String, tags: [String]}],
});

module.exports = mongoose.model('Question', questionSchema);
module.exports.questionSchema = questionSchema;

