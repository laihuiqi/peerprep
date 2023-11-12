const CollaborativeInput = require("../models/collaborationCodeModel");
const axios = require("axios");
const config = require("../config/config");

const getCollaborativeInput = async (sessionId) => {
	try {
		const dataOutput = await CollaborativeInput.findOne({sessionId: sessionId});

		console.log(`Get collaborative input for session ${sessionId}`);

		return [dataOutput.initTime, dataOutput.language, dataOutput.codes];
	} catch (error) {
		console.log(`Error getting collaborative input for session ${sessionId}`);

		return ["None", "", ""];
	}
};

const getCollaborativeInputByLine = async (sessionId, line) => {
	try {
		const dataOutput = await CollaborativeInput.findOne({
			sessionId: sessionId,
			"codes.line": line,
		});

		console.log(
			`Get collaborative input for session ${sessionId} line ${line}`
		);

		return [dataOutput.language, line, dataOutput.codes[line].code];
	} catch (error) {
		console.error(
			`Error getting collaborative input by line for session ${sessionId}`
		);

		return ["None", line, ""];
	}
};

const initCollaborativeCode = async (initTime, sessionId, language) => {
	try {
		const input = await getCollaborativeInput(sessionId);

		if (input[0] === "None") {
			const collaborativeInput = new CollaborativeInput({
				sessionId: sessionId,
				initTime: initTime,
				language: language,
				codes: [],
			});

			await collaborativeInput.save();

			console.log(`Successfully added:`, collaborativeInput);

			return [language, []];
		} else {
			console.log(`Collaborative input already exists for ${sessionId}`);

			return input;
		}
	} catch (error) {
		console.log(`Failed to add collaborative input for ${sessionId}`);

		return ["None", ""];
	}
};

const updateCollaborativeLineInput = async (
	sessionId,
	line,
	code,
	lastModifier
) => {
	try {
		let collaborativeInput = await CollaborativeInput.findOne({
			sessionId: sessionId,
			"codes.line": line,
		});

		if (collaborativeInput) {
			await CollaborativeInput.updateOne(
				{sessionId: sessionId, "codes.line": line},
				{$set: {"codes.$.code": code, "codes.$.lastModifier": lastModifier}}
			);
		} else {
			await CollaborativeInput.updateOne(
				{sessionId: sessionId},
				{$push: {codes: {line: line, code: code, lastModifier: lastModifier}}}
			);
		}

		console.log(`Successfully updated line:`, line);
	} catch (error) {
		console.log(
			`Failed to update collaborative input for ${sessionId} line ${line}`
		);
	}
};

const updateCollaborativeInput = async (sessionId, codes) => {
	try {
		let collaborativeInput = await CollaborativeInput.findOne({
			sessionId: sessionId,
		});
		const sessionReq = await axios.get(
			`${config.matchingServiceUrl}/getSession/${sessionId}`
		);

		const session = sessionReq.data.session;

		if (collaborativeInput.codes !== null) {
			collaborativeInput.codes = codes;
		} else {
			collaborativeInput = new CollaborativeInput({
				sessionId: sessionId,
				initTime: session.initTime,
				language: session.language,
				codes: codes,
			});
		}

		await collaborativeInput.save();

		console.log(`Successfully updated:`, collaborativeInput);
	} catch (error) {
		console.log(`Failed to update collaborative input for ${sessionId}`);
	}
};

const deleteCollaborativeInput = async (sessionId) => {
	try {
		const result = await CollaborativeInput.deleteOne({sessionId: sessionId});

		console.log(`Successfully deleted:`, result);
	} catch (error) {
		console.log(`Failed to delete collaborative input for ${sessionId}`);
	}
};

const deleteCollaborativeLineInput = async (sessionId, line) => {
	try {
		const collaborativeInput = await CollaborativeInput.findOne({
			sessionId: sessionId,
		});

		collaborativeInput.codes.splice(line, 1);

		await collaborativeInput.save();

		console.log(`Successfully deleted:`, collaborativeInput);
	} catch (error) {
		console.log(
			`Failed to delete collaborative input for ${sessionId} line ${line}`
		);
	}
};

module.exports = {
	getCollaborativeInput,
	getCollaborativeInputByLine,
	initCollaborativeCode,
	updateCollaborativeLineInput,
	updateCollaborativeInput,
	deleteCollaborativeInput,
	deleteCollaborativeLineInput,
};