const CollaborativeInput = require('../models/collaborationCodeModel');
const MatchedPair = require('../../matching-service/models/matchedPairModel');

const getCollaborativeInput = async(sessionId) => {
    try {
        const dataOutput = await CollaborativeInput.findOne({ sessionId: sessionId });
        console.log(`Get collaborative input for session ${sessionId}`);
        return (dataOutput.language, dataOutput.codes);
    } catch (error) {
        console.error(`Error getting collaborative input for session ${sessionId}:`, error);
        return ("None", "");
    }
}

const getCollaborativeInputByLine = async(sessionId, line) => {
    try {
        const dataOutput = await CollaborativeInput.findOne({ sessionId: sessionId, 'codes.line': line });
        console.log(`Get collaborative input for session ${sessionId} line {line}}`);
        return (dataOutput.language, line, dataOutput.codes[line].code);
    } catch (error) {
        console.error(`Error getting collaborative input for session ${sessionId}:`, error);
        return ("None", line, "");
    }
}

const initCollaborativeCode = async(sessionId, language) => {
    try {
        const collaborativeInput = new CollaborativeInput({ sessionId: sessionId, language: language, codes: [] });
        if (!collaborativeInput) {
            await collaborativeInput.save();
            console.log(`Successfully added:`, collaborativeInput);
        } else {
            console.log(`Collaborative input already exists for ${sessionId}`);
        }

    } catch (error) {
        console.error(`Failed to add collaborative input for ${sessionId}:`, error);
    }
}

const updateCollaborativeLineInput = async(sessionId, line, code, lastModifier) => {
    try {
        let collaborativeInput = await CollaborativeInput.findOne({ sessionId: sessionId });
        if (collaborativeInput.codes.has(line)) {
            collaborativeInput.codes[line].code = code;
            collaborativeInput.codes[line].lastModifier = lastModifier;
        } else {
            collaborativeInput.codes.push({ line: line, code: code, lastModifier: lastModifier });
        }
        await collaborativeInput.save();
        console.log(`Successfully updated:`, collaborativeInput);
    } catch (error) {
        console.error(`Failed to update collaborative input for ${sessionId} line ${line}:`, error);
    }
}

const updateCollaborativeInput = async(sessionId, codes) => {
    try {
        let collaborativeInput = await CollaborativeInput.findOne({ sessionId: sessionId });
        const language = await MatchedPair.getSession(sessionId).language;
        if (collaborativeInput) {
            collaborativeInput.language = language;
            collaborativeInput.codes = codes;
        } else {
            collaborativeInput = new CollaborativeInput({ sessionId: sessionId, language: language, codes: codes });
        }
        await collaborativeInput.save();
        console.log(`Successfully updated:`, collaborativeInput);
    } catch (error) {
        console.error(`Failed to update collaborative input for ${sessionId}:`, error);
    }
}

const deleteCollaborativeInput = async(sessionId) => {
    try {
        const result = await CollaborativeInput.deleteOne({ sessionId: sessionId });
        console.log(`Successfully deleted:`, result);
    } catch (error) {
        console.error(`Failed to delete collaborative input for ${sessionId}:`, error);
    }
}

const deleteCollaborativeLineInput = async(sessionId, line) => {
    try {
        const collaborativeInput = await CollaborativeInput.findOne({ sessionId: sessionId });
        collaborativeInput.codes.splice(line, 1);
        await collaborativeInput.save();
        console.log(`Successfully deleted:`, collaborativeInput);
    } catch (error) {
        console.error(`Failed to delete collaborative input for ${sessionId} line ${line}:`, error);
    }
}

module.exports = {
    getCollaborativeInput,
    getCollaborativeInputByLine,
    initCollaborativeCode,
    updateCollaborativeLineInput,
    updateCollaborativeInput,
    deleteCollaborativeInput,
    deleteCollaborativeLineInput
}