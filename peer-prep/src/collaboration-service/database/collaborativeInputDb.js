const CollaborativeInput = require('../models/collaborationCodeModel');
const MatchedPair = require('../../matching-service/models/matchedPairModel');
const { getMatchQuestion } = require('../../../../question-service/controllers/questionController');

const getCollaborativeInput = async(sessionId) => {
    try {
        const dataOutput = await CollaborativeInput.findOne({ sessionId: sessionId });
        console.log(`Get collaborative input for session ${sessionId}`);
        return [dataOutput.language, dataOutput.question, dataOutput.codes];
    } catch (error) {
        console.log(`Error getting collaborative input for session ${sessionId}:`, error);
        return ["None", "", ""];
    }
}

const getCollaborativeInputByLine = async(sessionId, line) => {
    try {
        const dataOutput = await CollaborativeInput.findOne({ sessionId: sessionId, 'codes.line': line });
        console.log(`Get collaborative input for session ${sessionId} line ${line}`);
        return [dataOutput.language, line, dataOutput.codes[line].code];
    } catch (error) {
        console.error(`Error getting collaborative input for session ${sessionId}:`, error);
        return ["None", line, ""];
    }
}

const initCollaborativeCode = async(sessionId, language, difficulty, topic) => {
    try {
        const input = await getCollaborativeInput(sessionId);

        if (input[0] === "None") {
            const matchingQuestion = getMatchQuestion(language, difficulty, topic);
            const collaborativeInput = new CollaborativeInput({ sessionId: sessionId, language: language, 
                question: matchingQuestion, codes: [] });
            await collaborativeInput.save();
            console.log(`Successfully added:`, collaborativeInput);

            return [language, matchingQuestion, []];
        } else {
            console.log(`Collaborative input already exists for ${sessionId}`);
            return input;
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
        const session = await MatchedPair.getSession(sessionId);
        if (collaborativeInput) {
            collaborativeInput.codes = codes;
        } else {
            const matchingQuestion = getMatchQuestion(session.language, session.difficulty, session.topic);
            collaborativeInput = new CollaborativeInput({ sessionId: sessionId, language: session.language, question: matchingQuestion, codes: codes });
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