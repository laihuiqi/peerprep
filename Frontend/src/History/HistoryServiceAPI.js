import {
  getUserAttemptsFromHistoryDatabase,
  addUserAttemptToHistoryDatabase,
} from "./HistoryServiceController";

async function getUserAttempts(userId) {
  const result = await getUserAttemptsFromHistoryDatabase(userId);

  if (result !== null && result.status === 200) {
    return result.data.result;
  }

  return null;
}

async function addUserAttempt(userId1, userId2, sessionId, questionId) {
  const result = await addUserAttemptToHistoryDatabase(
    userId1,
    userId2,
    sessionId,
    questionId
  );

  if (result !== null && result.status === 201) {
    return true;
  }

  return false;
}

export { addUserAttempt, getUserAttempts };
