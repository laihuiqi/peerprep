const mongoose = require('mongoose');

const matchedPairSchema = new mongoose.Schema({
    sessionId: String,
    id1: String,
    id2: String,
    isEnded: Boolean,
    question: mongoose.Schema.Types.ObjectId,
    language: String,
    proficiency: String,
    difficulty: String,
    topic: String
});

module.exports = mongoose.model('MatchedPair', matchedPairSchema);