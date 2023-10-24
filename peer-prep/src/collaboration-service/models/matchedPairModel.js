const mongoose = require('mongoose');
const Question = require('./questionModel');

const matchedPairSchema = new mongoose.Schema({
    sessionId: String,
    id1: Number,
    id2: Number,
    isEnded: Boolean,
    question: [Question],
    language: String,
    proficiency: String,
    difficulty: String,
    topic: String
});

module.exports = mongoose.model('MatchedPair', matchedPairSchema);