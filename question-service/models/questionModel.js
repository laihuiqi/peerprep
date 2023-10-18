const mongoose = require('mongoose');

const Schema = mongoose.Schema

const questionSchema = new Schema({
  title: {type: String, required: true},
  description: {type: String, required: true},
  complexity: {type: String, required: true},
  category: {type: String, required: true},
  userTags: [{ userId: String, tags: [String]}],
});

module.exports =  mongoose.model('Question', questionSchema);;

