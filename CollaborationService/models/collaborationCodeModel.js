const mongoose = require('mongoose');

const lineInputSchema = new mongoose.Schema({
    line: Number,
    code: String,
    lastModifier: String
});

const collaborativeInputSchema = new mongoose.Schema({
    sessionId: String,
    initTime: Number,
    language: String,
    codes: [lineInputSchema]
});


module.exports = mongoose.model('CollaborativeInput', collaborativeInputSchema);