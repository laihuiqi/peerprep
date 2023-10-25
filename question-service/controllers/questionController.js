const Question = require('../models/questionModel')
const mongoose = require('mongoose')

const checkIdValidity = (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(500).json({ error: 'Invalid question ID'});
  }
}

const checkQuestionValidity = (question) => {
  if (!question) {
    res.status(500).json({ error: 'Question not found'});
  }
}

const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find({}).sort({createdAt: -1});
        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving questions'});
    }
}

const getMatchQuestion = async (language, difficulty, topic) => {
  let aggregationPipeline = [];

  if (language !== "None") {
    aggregationPipeline.push({ $match: { language: language } });
  }

  if (difficulty !== "None") {
    aggregationPipeline.push({ $match: { complexity: difficulty } });
  }

  if (topic !== "None") {
    aggregationPipeline.push({ $match: { topic: topic } });
  }

  aggregationPipeline.push({ $sample: { size: 1 } });

  let question = await Question.aggregate(aggregationPipeline);

  question = question[0];
    
  if (question) {
    return question;

  } else {
    return null;
  }
}
  
const createQuestion = async (req, res) => {
  const { title, description, complexity, category, language } = req.body;
  const currentSameDescriptionQuestion = await Question.findOne({ description });

  if (currentSameDescriptionQuestion) {
    return res.status(400).json({ error: 'Question with an identical description already exists' });
  }

  try {
    const question = new Question({
      _id: new mongoose.Types.ObjectId(),
      title,
      description,
      complexity,
      category,
      language,
    });

    const newQuestion = await question.save();
    res.status(200).json(newQuestion);
  } catch (error) {
    if (!title || !description || !complexity || !category || !language) {
      return res.status(400).json({ error: 'Missing fields are not allowed. Please fill all fields.' });
    }
    res.status(400).json({ error: 'Unable to create a new question' });
  }
}

const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { title, description, complexity, category, language } = req.body;
  
  try {
      checkIdValidity(id);
      const question = await Question.findById(id);
      checkQuestionValidity(question);

      if (description !== question.description) {
          const currentSameDescriptionQuestion = await Question.findOne({ description });
          if (currentSameDescriptionQuestion) {
              return res.status(400).json({ error: 'Question with this description already exists.' });
          }
      }

      question.title = title;
      question.description = description;
      question.complexity = complexity;
      question.category = category;
      question.language = language;
      const updatedQuestion = await question.save();
      res.status(200).json(updatedQuestion);
  } catch (error) {
      if (!title || !description || !complexity || !category || !language) {
        return res.status(400).json({ error: 'Missing fields are not allowed. Please fill all fields.' });
      }
      res.status(500).json({ error: 'Unable to update question' });
  }
}


const deleteQuestion = async (req, res) => {
    const { id } = req.params;
    checkIdValidity(id);
    const question = await Question.findOneAndDelete({_id: id});
    checkQuestionValidity(question);
    res.status(200).json(question);
}

const addUserTag = async (req, res) => {
  const { id } = req.params;
  const { userId, tag } = req.body;

  try {
    checkIdValidity(id);
    const question = await Question.findById(id);
    checkQuestionValidity(question);

    const userIndex = question.userTags.findIndex((value) => value.userId === userId);

    if (userIndex != -1) {
      question.userTags[userIndex].tags.push(tag);
    } else {
      question.userTags.push({ userId, tags:[tag] });
    }

    const modifiedQuestion = await question.save();
    res.status(200).json(modifiedQuestion);
  } catch (error) {
    res.status(500).json({ error: 'Unable to add tag' });
  }
}

const deleteUserTag = async (req, res) => {
  const { id } = req.params;
  const { userId, tag } = req.body;

  try {
    checkIdValidity(id);
    const question = await Question.findById(id);
    checkQuestionValidity(question);

    const userIndex = question.userTags.findIndex((value) => value.userId === userId);

    if (userIndex == -1) {
      res.status(400).json({ error: 'Error with finding user for question' });
    } else {
      const tagIndex = question.userTags[userIndex].tags.indexOf(tag);
      if (tagIndex == -1) {
        res.status(400).json({ error: 'Error with finding tag for user' });
      } else {
        question.userTags[userIndex].tags.splice(tagIndex, 1);
        const updatedQuestion = await question.save();
        res.status(200).json(updatedQuestion);
      }
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete tag' });
  }
}

  module.exports = {
    getAllQuestions,
    getMatchQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    addUserTag,
    deleteUserTag
  }