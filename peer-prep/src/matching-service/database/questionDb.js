const Question = require('../models/questionModel');

const getMatchQuestion = async (language, difficulty, topic) => {
    console.log('getMatchQuestion', language, difficulty, topic);
    let aggregationPipeline = [];
  
    if (language !== "None") {
        console.log('language', language);
        aggregationPipeline.push({ $match: { language: language } });
    }
  
    if (difficulty !== "None") {
        console.log('difficulty', difficulty);
        aggregationPipeline.push({ $match: { complexity: difficulty } });
    }
  
    if (topic !== "None") {
        console.log('topic', topic);
        aggregationPipeline.push({ $match: { topic: topic } });
    }
  
    aggregationPipeline.push({ $sample: { size: 1 } });
  
    let question = await Question.aggregate(aggregationPipeline);

    console.log('question', question);
  
    question = question[0];
      
    if (question) {
        console.log('get', question);
        return question;
  
    } else {
        console.log('No question found');
        return null;
    }
  }

const addQuestion = async (question) => {
    await Question.create(question);
    console.log('add', question);
}

module.exports = { getMatchQuestion, addQuestion };