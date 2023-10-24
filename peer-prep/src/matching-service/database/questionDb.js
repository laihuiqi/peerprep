const Question = require('../models/questionModel');

const getMatchQuestion = async (language, difficulty, topic) => {
    const questions = await Question.findOne({ complexity: difficulty, topic: topic, language: language });
    console.log(difficulty, topic, language);
    if (questions) {
      return questions;
    } else {
      return null;
    }
};

module.exports = { getMatchQuestion };