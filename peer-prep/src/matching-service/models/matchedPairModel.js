const mongoose = require('mongoose');
const { questionSchema } = require('./questionModel');

const matchedPairSchema = new mongoose.Schema({
    sessionId: String,
    id1: String,
    id2: String,
    isEnded: Boolean,
    question: questionSchema,
    language: String,
    proficiency: String,
    difficulty: String,
    topic: String
});

module.exports = mongoose.model('MatchedPair', matchedPairSchema);