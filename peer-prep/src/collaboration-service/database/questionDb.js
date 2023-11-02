const Question = require('../models/questionModel');

const getMatchQuestion = async (language, difficulty, category) => {
    console.log('getMatchQuestion', language, difficulty, category);
    
    let aggregationPipeline = [];
  
    if (language !== "None") {
        console.log('language', language);

        aggregationPipeline.push({ $match: { language: language } });
    }
  
    if (difficulty !== "None") {
        console.log('difficulty', difficulty);

        aggregationPipeline.push({ $match: { complexity: difficulty } });
    }
  
    if (category !== "None") {
        console.log('category', category);

        aggregationPipeline.push({ $match: { category: category } });
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

const getQuestion = async (questionId) => {
    const question = await Question.findById(questionId);

    console.log('get', questionId);

    return question;
}

module.exports = { getMatchQuestion, addQuestion, getQuestion };