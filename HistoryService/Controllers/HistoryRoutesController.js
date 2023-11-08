const {
  getAttemptDetailsFromDatabase,
  addAttemptDetailsToDatabase,
} = require("./HistoryDatabaseController");

const getAttemptDetails = async (req, res, next) => {
  const userId = req.params.userId;

  const result = await getAttemptDetailsFromDatabase(userId);

  if (result !== undefined) {
    res.status(200).json({
      message: "SUCCESSFUL: GET USER ATTEMPT HISTORY",
      result: result[0],
    });

    return;
  }

  res.status(404).json({
    message: "NO HISTORY DATA FOUND: GET USER ATTEMPT HISTORY",
    result: [],
  });
};

const addAttemptDetails = async (req, res, next) => {
  const userId1 = req.body.userId1;
  const userId2 = req.body.userId2;
  const sessionId = req.body.sessionId;
  const questionId = req.body.questionId;

  const result = await addAttemptDetailsToDatabase(
    userId1,
    userId2,
    sessionId,
    questionId
  );

  if (result !== undefined) {
    res.status(201).json({
      message: "SUCCESSFUL: ADD USER ATTEMPT HISTORY",
      result: result[0],
    });

    return;
  }

  res.status(404).json({
    message: "HISTORY DATA COULD NOT BE ADDED",
    result: result,
  });
};

module.exports = {
  getAttemptDetails,
  addAttemptDetails,
};
