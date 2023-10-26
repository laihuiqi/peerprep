const mongoose = require('mongoose');
const { questionSchema } = require('./questionModel');

const matchedPairSchema = new mongoose.Schema({
    sessionId: String,
    id1: Number,
    id2: Number,
    isEnded: Boolean,
    question: questionSchema,
    language: String,
    proficiency: String,
    difficulty: String,
    topic: String
});

module.exports = mongoose.model('MatchedPair', matchedPairSchema);