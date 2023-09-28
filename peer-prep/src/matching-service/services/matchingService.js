const config = require('../config/config');
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');
const { addMatchedPair, getCurrentMatchedPair } = require('../database/matchedPairDb');
const MatchedPair = require('../models/matchedPairModel');
const matchedPairDb = require('../database/matchedPairDb');


const refreshDuration = 3000; // 3 seconds
const waitingDuration = 3000;
const matchingDuration = 60000 - waitingDuration;
const queueName = 'matchingQueue';

let isCancelled = new Set();
let availabilityCache = new Set();

// Find matching pair based on the selected criteria : language, proficiency, difficulty, topic
async function findMatch(request) {

    return new Promise(async(resolve) => {
        let connection;
        let channel;
        let checkCancel;

        try {
            connection = await amqp.connect(config.rabbitmqUrl);
            channel = await connection.createChannel();

            console.log('Successfully connected to RabbitMQ');

            const criteria = `${request.language || 'None'}
                            .${request.proficiency || 'None'}
                            .${request.difficulty || 'None'}
                            .${request.topic || 'None'}`;

            checkCancel = setInterval(async() => {
                if (isCancelled.has(parseInt(request.id))) {
                    clearInterval(checkCancel);
                    resolve({ isMatched: false, collaboratorId: null, request: request });

                } else {
                    const checkMatchedPair = await getCurrentMatchedPair(request.id);

                    if (checkMatchedPair) {
                        clearInterval(checkCancel);
                        resolve({
                            isMatched: true,
                            collaboratorId: String(checkMatchedPair.id1) === String(request.id) ?
                                parseInt(checkMatchedPair.id2) : parseInt(checkMatchedPair.id1),
                            request: request
                        });
                    }
                }
            }, refreshDuration);

            await addRequestIntoQueue(channel, criteria, request);

            await new Promise(resolve => setTimeout(resolve, waitingDuration));
            // wait for 5 seconds to check if there is a prior object that matched

            const { stored, isMatched, id, collaboratorId } =
            await getMatchFromQueue(channel, criteria, request);

            console.log(`Clean up tasks are completed for ${request.id}!`);

            if (!isMatched) {
                console.log(`Matched pair could not be found for ${request.id}`);

                resolve({ isMatched: false, collaboratorId: null, request: request });

            } else if (stored) {
                resolve({
                    isMatched: true,
                    collaboratorId: parseInt(collaboratorId),
                    request: request
                });

            } else if (isMatched && !stored) {
                const matchedPair = new MatchedPair({
                    sessionId: uuidv4(),
                    id1: parseInt(id),
                    id2: parseInt(collaboratorId),
                    isEnded: false,
                    language: request.language,
                    proficiency: request.proficiency,
                    difficulty: request.difficulty,
                    topic: request.topic
                });

                await addMatchedPair(matchedPair);

                resolve({
                    isMatched: true,
                    collaboratorId: parseInt(collaboratorId),
                    request: request
                });
            }
        } catch (error) {
            console.log('Error finding match: ', error);
            throw error;

        } finally {
            availabilityCache.delete(request.id);

            if (channel) {
                channel.close();
            }
            if (connection) {
                connection.close();
            }
        }
    });
}

function criteriaMatches(requestCriteria, currentCriteria) {
    const fields = ['language', 'proficiency', 'difficulty', 'topic'];
    for (let field of fields) {
        if (requestCriteria[field] !== "None" &&
            currentCriteria[field] !== "None" &&
            requestCriteria[field] !== currentCriteria[field]) {
            return false;
        }
    }
    return true;
}

// Add new request into the queue, 'topic' exchange type is used to route the message
async function addRequestIntoQueue(channel, criteria, request) {
    try {
        await channel.assertQueue(queueName, { durable: false });

        const message = JSON.stringify({ criteria: criteria, request: request });
        channel.sendToQueue(queueName, Buffer.from(message), { expiration: matchingDuration });
        availabilityCache.add(request.id);
        isCancelled.delete(parseInt(request.id));

        console.log(`Successfully added request into queue for user ${request.id}`);

    } catch (error) {
        console.log('Error adding request into queue: ', error);
        return error.message;
    }
}

// Check if there exists a matched pair for the user, else, find a match from the queue
async function getMatchFromQueue(channel, criteria, request) {
    console.log(`Checking if there is a match for user ${request.id} and find match from queue...`);

    const currentPair = await getCurrentMatchedPair(request.id);

    if (currentPair) {
        const collaboratorId =
            String(currentPair.id1) === String(request.id) ? currentPair.id2 : currentPair.id1;

        return { stored: true, isMatched: true, id: request.id, collaboratorId: collaboratorId };

    } else {
        return listenToMatchingQueue(channel, criteria, request);
    }
}

// Listen to the queue for a matching pair
async function listenToMatchingQueue(channel, criteria, request) {
    try {
        console.log(`Start matching user ${request.id}`);

        await channel.assertQueue(queueName, { durable: false });

        let matched = false;
        return new Promise(async(resolve) => {
            setTimeout(() => {
                if (!matched) {
                    resolve({
                        stored: false,
                        isMatched: false,
                        id: request.id,
                        collaboratorId: null
                    });
                }
            }, matchingDuration);

            console.log(`Start listening to matching queue for user ${request.id}`);

            channel.consume(queueName, async(message) => {
                const currentRequest = JSON.parse(message.content.toString());
                const checkActivePair = await getCurrentMatchedPair(currentRequest.request.id);
                
                // Check if there is an active pair and if the criteria still match
                if (checkActivePair && criteriaMatches(request, currentRequest.request)) {
                    const collaboratorId = String(checkActivePair.id1) === String(request.id) ? checkActivePair.id2 : checkActivePair.id1;
                    resolve({
                        stored: true,
                        isMatched: true,
                        id: request.id,
                        collaboratorId: collaboratorId
                    });

                } else if (checkActivePair ||
                    isCancelled.has(parseInt(currentRequest.request.id))) {

                    console.log(`Remove match ${currentRequest.request.id}`);
                    availabilityCache.delete(currentRequest.request.id);
                    channel.ack(message);

                } else if (!matched &&
                    currentRequest.request.id !== request.id && criteriaMatches(request, currentRequest.request) &&
                    availabilityCache.has(currentRequest.request.id)) {

                    console.log(`Found a match for ${request.id}`);

                    channel.ack(message);
                    availabilityCache.delete(currentRequest.request.id);
                    availabilityCache.delete(request.id);
                    console.log(`${request.id} has been matched with
                                 ${currentRequest.request.id}`);

                    matched = true;
                    console.log(`Successfully matched user ${request.id}`);

                    resolve({
                        stored: false,
                        isMatched: matched,
                        id: request.id,
                        collaboratorId: currentRequest.request.id
                    });
                }
            });
        });
    } catch (error) {
        return error.message;
    }
}

// Cancel matching service

//async function cancelMatch(requestId) {
//    isCancelled.add(parseInt(requestId));
//    availabilityCache.delete(requestId);
//
//    console.log(`Matching service is cancelled for ${requestId}`);

//    return true;
//}

async function cancelMatch(requestId) {
    // Adding the requestId to the cancelled set
    isCancelled.add(parseInt(requestId));
    
    // Removing the requestId from the availability cache
    availabilityCache.delete(requestId);

    console.log(`Matching service is cancelled for ${requestId}`);

    // Check if there's an ongoing session for the given requestId
    const currentMatchedPair = await matchedPairDb.getCurrentMatchedPair(requestId);
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