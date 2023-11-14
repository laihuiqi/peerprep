const config = require("../config/config");
const amqp = require("amqplib");
const { v4: uuidv4 } = require("uuid");
const {
  addMatchedPair,
  getCurrentMatchedPair,
} = require("../database/matchedPairDb");
const MatchedPair = require("../models/matchedPairModel");
const matchedPairDb = require("../database/matchedPairDb");
const axios = require("axios");

let isCancelled = new Set();
let availabilityCache = new Map();

// Find matching pair based on the selected criteria : language, proficiency, difficulty, topic
async function findMatch(request) {
  return new Promise(async (resolve) => {
    let rabbitmqConnection;
    let channel;
    let checkCancel;
    let matchId = null;

    try {
      rabbitmqConnection = await amqp.connect(config.rabbitmqUrl);
      channel = await rabbitmqConnection.createChannel();

      console.log("Successfully connected to RabbitMQ");

      const criteria = `${request.language}
                            .${request.proficiency}
                            .${request.difficulty}
                            .${request.topic}`;

      checkCancel = setInterval(async () => {
        if (matchId && isCancelled.has(matchId)) {
          clearInterval(checkCancel);
          resolve({
            status: "cancel",
            isMatched: false,
            sessionId: null,
            questionId: null,
            collaboratorId: null,
            request: request,
          });
        } else {
          const checkMatchedPair = await getCurrentMatchedPair(request.id);

          if (checkMatchedPair) {
            clearInterval(checkCancel);
            resolve({
              status: "success",
              isMatched: true,
              sessionId: checkMatchedPair.sessionId,
              questionId: checkMatchedPair.questionId,
              collaboratorId:
                checkMatchedPair.id1 === request.id
                  ? checkMatchedPair.id2
                  : checkMatchedPair.id1,
              request: request,
            });
          }
        }
      }, config.refreshDuration);

      await new Promise((resolve) =>
        setTimeout(resolve, config.waitingDuration)
      );

      matchId = await addRequestIntoQueue(channel, criteria, request);

      await new Promise((resolve) =>
        setTimeout(resolve, config.waitingDuration)
      );
      // wait for 5 seconds to check if there is a prior object that matched

      const { stored, isMatched, sessionId, questionId, id, collaboratorId } =
        await getMatchFromQueue(channel, matchId, request);

      if (!isMatched && !stored) {
        console.log(`Matched pair could not be found for ${request.id}`);

        resolve({
          status: "error",
          isMatched: false,
          sessionId: null,
          questionId: null,
          collaboratorId: null,
          request: request,
        });
      } else if (stored) {
        resolve({
          status: "success",
          isMatched: true,
          sessionId: sessionId,
          questionId: questionId,
          collaboratorId: collaboratorId,
          request: request,
        });
      } else if (isMatched && !stored) {
        const questionId = await getMatchQuestion(
          request.language,
          request.difficulty,
          request.topic
        );
        const matchedPair = new MatchedPair({
          sessionId: uuidv4(),
          id1: id,
          id2: collaboratorId,
          isEnded: false,
          questionId: questionId,
          language: request.language,
          proficiency: request.proficiency,
          difficulty: request.difficulty,
          topic: request.topic,
        });

        await addMatchedPair(matchedPair);

        resolve({
          status: "success",
          isMatched: true,
          sessionId: matchedPair.sessionId,
          questionId: matchedPair.questionId,
          collaboratorId: collaboratorId,
          request: request,
        });
      }
    } catch (error) {
      console.log("Error finding match: ", error);

      resolve({
        status: "error",
        message: error.message,
        isMatched: false,
        sessionId: null,
        questionId: null,
        collaboratorId: null,
        request: request,
      });
    } finally {
      availabilityCache.delete(request.id);

      clearInterval(checkCancel);

      if (channel) {
        await channel.close();
      }
      if (rabbitmqConnection) {
        await rabbitmqConnection.close();
      }

      console.log(`Clean up tasks are completed for ${request.id}!`);
    }
  });
}

function criteriaMatches(requestCriteria, currentCriteria) {
  const fields = ["language", "proficiency", "difficulty", "topic"];

  for (let field of fields) {
    if (requestCriteria[field] !== currentCriteria[field]) {
      return false;
    }
  }

  return true;
}

// Add new request into the queue
async function addRequestIntoQueue(channel, criteria, request) {
  try {
    await channel.assertQueue(config.queueName, { durable: false });

    const matchId = uuidv4();
    const message = JSON.stringify({
      matchId: matchId,
      criteria: criteria,
      request: request,
    });

    channel.sendToQueue(config.queueName, Buffer.from(message), {
      expiration: config.matchingDuration,
    });

    availabilityCache.set(request.id, matchId);

    console.log(`Successfully added request into queue for user ${request.id}`);

    return matchId;
  } catch (error) {
    console.log("Error adding request into queue: ", error);

    return error.message;
  }
}

// Check if there exists a matched pair for the user, else, find a match from the queue
async function getMatchFromQueue(channel, matchId, request) {
  console.log(
    `Checking if there is a match for user ${request.id} and find match from queue...`
  );

  const currentPair = await getCurrentMatchedPair(request.id);

  if (currentPair) {
    const collaboratorId =
      currentPair.id1 === request.id ? currentPair.id2 : currentPair.id1;

    return {
      stored: true,
      isMatched: true,
      sessionId: currentPair.sessionId,
      questionId: currentPair.questionId,
      id: request.id,
      collaboratorId: collaboratorId,
    };
  } else {
    return listenToMatchingQueue(channel, matchId, request);
  }
}

// Listen to the queue for a matching pair
async function listenToMatchingQueue(channel, matchId, request) {
  try {
    console.log(`Start matching user ${request.id}`);

    await channel.assertQueue(config.queueName, { durable: false });

    let matched = false;

    return new Promise(async (resolve) => {
      setTimeout(() => {
        if (!matched) {
          resolve({
            stored: false,
            isMatched: false,
            sessionId: null,
            questionId: null,
            id: request.id,
            collaboratorId: null,
          });
        }
      }, config.matchingDuration);

      console.log(`Start listening to matching queue for user ${request.id}`);

      channel.consume(config.queueName, async (message) => {
        const currentRequest = JSON.parse(message.content.toString());
        const checkActivePair = await getCurrentMatchedPair(
          currentRequest.request.id
        );

        // Check if there is an active pair and if the criteria still match
        if (
          checkActivePair ||
          isCancelled.has(
            currentRequest.matchId ||
              availabilityCache.get(currentRequest.request.id) !==
                currentRequest.matchId
          )
        ) {
          console.log(`Remove match ${currentRequest.request.id}`);

          availabilityCache.delete(currentRequest.request.id);

          channel.ack(message);
        } else if (
          !matched &&
          currentRequest.request.id !== request.id &&
          criteriaMatches(request, currentRequest.request) &&
          availabilityCache.has(currentRequest.request.id) &&
          availabilityCache.get(request.id) === matchId &&
          !isCancelled.has(matchId)
        ) {
          console.log(`Found a match for ${request.id}`);

          channel.ack(message);

          availabilityCache.delete(currentRequest.request.id);
          availabilityCache.delete(request.id);

          console.log(
            `${request.id} has been matched with ${currentRequest.request.id}`
          );

          matched = true;

          console.log(`Successfully matched user ${request.id}`);

          resolve({
            stored: false,
            isMatched: matched,
            sessionId: null,
            questionId: null,
            id: request.id,
            collaboratorId: currentRequest.request.id,
          });
        }
      });
    });
  } catch (error) {
    return error.message;
  }
}

async function getMatchQuestion(language, difficulty, topic) {
  const url = `${config.questionServiceUrl}/match`;
  const jsonReq = {
    language: language,
    difficulty: difficulty,
    category: topic,
  };

  try {
    const response = await axios.post(url, jsonReq);

    console.log(
      "Successfully get match question: ",
      response.data.question._id
    );

    return response.data.question._id;
  } catch (error) {
    console.log("Error getting match question: ", error);

    return null;
  }
}

async function cancelMatch(requestId) {
  // Adding the requestId to the cancelled set
  isCancelled.add(availabilityCache.get(requestId));

  // Removing the requestId from the availability cache
  availabilityCache.delete(requestId);

  console.log(`Matching service is cancelled for ${requestId}`);

  // Check if there's an ongoing session for the given requestId
  const currentMatchedPair = await matchedPairDb.getCurrentMatchedPair(
    requestId
  );

  if (currentMatchedPair) {
    console.log(`Found ongoing session for ${requestId}. Terminating...`);

    try {
      await matchedPairDb.endSession(currentMatchedPair.sessionId);

      console.log(`Successfully terminated session for ${requestId}`);
    } catch (error) {
      console.error(`Error while terminating session for ${requestId}:`, error);

      throw error;
    }
  } else {
    console.log(`No ongoing session found for ${requestId}`);
  }

  return true;
}

module.exports = { findMatch, cancelMatch };
