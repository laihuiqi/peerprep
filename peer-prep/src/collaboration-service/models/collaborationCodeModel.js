const mongoose = require('mongoose');

const lineInputSchema = new mongoose.Schema({
    line: Number,
    code: String,
    lastModifier: Number
});

const collaborativeInputSchema = new mongoose.Schema({
    sessionId: String,
    language: String,
    codes: [lineInputSchema]
});

module.exports = mongoose.model('CollaborativeInput', collaborativeInputSchema);