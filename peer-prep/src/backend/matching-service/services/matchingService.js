const config = require('../config/config');
const amqp = require('amqplib');
const { v4: uuidv4 } = require('uuid');
const { addMatchedPair, getCurrentMatchedPair } = require('../database/matchedPairDb');
const MatchedPair = require('../models/matchedPairModel');

const matchingDuration = 60000; // 60 seconds
const refreshDuration = 5000; // 5 seconds
const queueName = 'matchingQueue';
const exchangeName = 'matchingExchange';
const exchangeType = 'topic';

let isCancelled = new Set();
let availabilityCache = new Set();

// Find matching pair based on the selected criteria : language, proficiency, difficulty, topic
async function findMatch(request) {
    try {
        const connection = await amqp.connect(config.rabbitmqUrl);
        const channel = await connection.createChannel();
        console.log('Successfully connected to RabbitMQ');

        const criteria = `${request.language}.${request.proficiency}.${request.difficulty}.${request.topic}`;

        await addRequestIntoQueue(channel, criteria, request);

        const { stored, isMatched, id, collaboratorId } = await getMatchFromQueue(channel, criteria, request);

        channel.close();
        connection.close();
        availabilityCache.delete(request.id);

        console.log(`Clean up tasks are completed for this match!`);

        const checkMatchedPair = await getCurrentMatchedPair(request.id);
        if (checkMatchedPair) {
            return {
                isMatched: true,
                collaboratorId: String(checkMatchedPair.id1) === String(request.id) ? checkMatchedPair.id2 : checkMatchedPair.id1,
                request: request
            };
        }
        if (isCancelled.has(request.id)) {
            console.log(`Matching service is cancelled`);
            isCancelled.delete(request.id);
            return { isMatched: false, collaboratorId: null, request: request };

        } else if (!isMatched) {
            console.log(`Matched pair could not be found for ${request.id}`);
            return { isMatched: false, collaboratorId: null, request: request };

        } else if (stored) {
            return { isMatched: true, collaboratorId: collaboratorId, request: request };

        } else if (isMatched && !stored) {
            const matchedPair = new MatchedPair({
                sessionId: uuidv4(),
                id1: id,
                id2: collaboratorId,
                isEnded: false,
                language: request.language,
                proficiency: request.proficiency,
                difficulty: request.difficulty,
                topic: request.topic

            });

            await addMatchedPair(matchedPair);

            return { isMatched: true, collaboratorId: collaboratorId, request: request };
        }
    } catch (error) {
        console.log('Error finding match: ', error);
    }
}

// Add new request into the queue, 'topic' exchange type is used to route the message to the correct queue
async function addRequestIntoQueue(channel, criteria, request) {
    try {
        await channel.assertExchange(exchangeName, exchangeType, { durable: false });
        await channel.assertQueue(queueName, { durable: false });
        await channel.bindQueue(queueName, exchangeName, criteria);

        const message = JSON.stringify({ criteria: criteria, request: request });
        channel.publish(exchangeName, criteria, Buffer.from(message), { expiration: matchingDuration });
        availabilityCache.add(request.id);
        isCancelled.delete(request.id);

        console.log(`Successfully added request into queue for user ${request.id}`);

    } catch (error) {
        console.log('Error adding request into queue: ', error);
        return error.message;
    }
}

// Check if there exists a matched pair for the user
async function getExistingMatchedPair(request) {
    console.log(`Checking if user ${request.id} has an ongoing matched pair...`);

    return new Promise(async(resolve) => {
        const currentPair = await getCurrentMatchedPair(request.id);

        if (currentPair) {
            const collaboratorId = String(currentPair.id1) === String(request.id) ? currentPair.id2 : currentPair.id1;
            return resolve({ stored: true, isMatched: true, id: request.id, collaboratorId: collaboratorId });

        } else {
            return resolve(null);
        }
    });
}

// Check if there exists a matched pair for the user, else, find a match from the queue
async function getMatchFromQueue(channel, criteria, request) {
    console.log(`Checking if there is a match for user ${request.id} and find match from queue...`);
    const existingMatch = await getExistingMatchedPair(request);

    if (existingMatch) {
        return existingMatch;
    }
    return listenToMatchingQueue(channel, criteria, request);
}

// Listen to the queue for a matching pair
async function listenToMatchingQueue(channel, criteria, request) {
    try {
        console.log(`Start matching user ${request.id}`);
        await channel.assertExchange(exchangeName, exchangeType, { durable: false });
        await channel.assertQueue(queueName, { durable: false });
        await channel.bindQueue(queueName, exchangeName, criteria);

        let matched = false;
        return new Promise(async(resolve) => {
            setTimeout(() => {
                if (!matched) {
                    resolve({ stored: false, isMatched: false, id: request.id, collaboratorId: null });
                }
            }, matchingDuration);

            const checkCancel = setInterval(async() => {
                if (isCancelled.has(request.id)) {
                    clearInterval(checkCancel);
                    resolve({ stored: false, isMatched: false, id: request.id, collaboratorId: null });

                } else {
                    const checkCurrentPair = await getCurrentMatchedPair(request.id);
                    if (checkCurrentPair) {
                        clearInterval(checkCancel);
                        resolve({
                            stored: true,
                            isMatched: true,
                            id: request.id,
                            collaboratorId: String(checkCurrentPair.id1) === String(request.id) ? checkCurrentPair.id2 : checkCurrentPair.id1
                        });
                    }
                }
            }, refreshDuration);

            console.log(`Start listening to matching queue for user ${request.id}`);

            channel.consume(queueName, async(message) => {
                const currentRequest = JSON.parse(message.content.toString());
                const checkActivePair = await getCurrentMatchedPair(currentRequest.request.id);

                if (checkActivePair &&
                    (String(checkActivePair.id1) === String(request.id) || String(checkActivePair.id2) === String(request.id))) {
                    resolve({ stored: true, isMatched: true, id: request.id, collaboratorId: currentRequest.request.id });

                } else if (checkActivePair || isCancelled.has(currentRequest.request.id)) {
                    console.log(`Cancel match ${currentRequest.request.id}`);
                    channel.ack(message);

                } else if (!matched && currentRequest.request.id !== request.id &&
                    currentRequest.criteria === criteria && availabilityCache.has(currentRequest.request.id)) {
                    console.log(`Found a match for ${request.id}`);

                    channel.ack(message);
                    availabilityCache.delete(currentRequest.request.id);
                    availabilityCache.delete(request.id);
                    console.log(`${request.id} has been matched with ${currentRequest.request.id}`);

                    matched = true;
                    console.log(`Successfully matched user ${request.id}`);

                    resolve({ stored: false, isMatched: matched, id: request.id, collaboratorId: currentRequest.request.id });
                }
            });
        });
    } catch (error) {
        return error.message;
    }
}

// Cancel matching service
async function cancelMatch(requestId) {
    isCancelled.add(requestId);
    availabilityCache.delete(requestId);
    console.log('Matching service is cancelled');
    return true;
}

module.exports = { findMatch, cancelMatch };