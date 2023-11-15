const {
  getAttemptDetailsFromDatabase,
  addAttemptDetailsToDatabase,
} = require("./HistoryDatabaseController");

const getAttemptDetails = async (req, res, next) => {
  const userId = req.params.userId;

  const result = await getAttemptDetailsFromDatabase(userId);
  console.log(result[0]);
  if (result !== undefined) {
    if (result[0].length === 0) {
      res.status(404).json({
        message: "NO HISTORY DATA FOUND: GET USER ATTEMPT HISTORY",
        result: result[0],
      });

      return;
    }

    res.status(200).json({
      message: "SUCCESSFUL: GET USER ATTEMPT HISTORY",
      result: result[0],
    });

    return;
  }

  res.status(500).json({
    message: "NO HISTORY DATA FOUND",
    result: [],
  });
};

const addAttemptDetails = async (req, res, next) => {
  const userId1 = req.body.userId1;
  const userId2 = req.body.userId2;
  const sessionId = req.body.sessionId;
  const questionId = req.body.questionId;
  const questionTitle = req.body.questionTitle;
  const questionDescription = req.body.questionDescription;
  const questionCategory = req.body.questionCategory;
  const questionComplexity = req.body.questionComplexity;

  const result = await addAttemptDetailsToDatabase(
    userId1,
    userId2,
    sessionId,
    questionId,
    questionTitle,
    questionDescription,
    questionCategory,
    questionComplexity
  );

  if (result !== undefined) {
    res.status(201).json({
      message: "SUCCESSFUL: ADD USER ATTEMPT HISTORY",
      result: result[0],
    });

    return;
  }

  res.status(500).json({
    message: "HISTORY DATA COULD NOT BE ADDED",
    error: "Internal Error",
  });
};

module.exports = {
  getAttemptDetails,
  addAttemptDetails,
};
