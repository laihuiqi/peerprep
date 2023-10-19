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
  
const createQuestion = async (req, res) => {
  let { title, description, complexity, category } = req.body;

  title = title.trim();
  description = description.trim();
  
  const smallCaseTitle = title.toLowerCase();
  const smallCaseDescription = description.toLowerCase();

  const currentSameTitleQuestion = await Question.findOne({ title: { $regex: new RegExp(`^${smallCaseTitle}$`, 'i') } });
  const currentSameDescriptionQuestion = await Question.findOne({ description: { $regex: new RegExp(`^${smallCaseDescription}$`, 'i') } });

  if (currentSameDescriptionQuestion && currentSameTitleQuestion) {
    return res.status(400).json({ error: 'Question with an identical title and description already exists' });
  }

  if (currentSameDescriptionQuestion) {
    return res.status(400).json({ error: 'Question with an identical description already exists' });
  }

  if (currentSameTitleQuestion) {
    return res.status(400).json({ error: 'Question with an identical title already exists' });
  }

  try {
    const question = await Question.create({ title, description, complexity, category });
    res.status(200).json(question);
  } catch (error) {
    if (!title || !description || !complexity || !category) {
      return res.status(400).json({ error: 'Missing fields are not allowed. Please fill all fields.'});
    }
    res.status(400).json({ error: 'Unable to create a new question' });
  }
}

const updateQuestion = async (req, res) => {
  const { id } = req.params;
  let { title, description, complexity, category } = req.body;
  
  
  checkIdValidity(id);
  const question = await Question.findById(id);
  checkQuestionValidity(question);

  title = title.trim();
  description = description.trim();
    
  const smallCaseTitle = title.toLowerCase();
  const smallCaseDescription = description.toLowerCase();
    
  if (title !== question.title) {
    const currentSameTitleQuestion = await Question.findOne({ title: { $regex: new RegExp(`^${smallCaseTitle}$`, 'i') } });

    if (currentSameTitleQuestion) {
      return res.status(400).json({ error: 'Question with an identical title already exists.' });
    }
  }

  if (description !== question.description) {
    const currentSameDescriptionQuestion = await Question.findOne({ description: { $regex: new RegExp(`^${smallCaseDescription}$`, 'i') } });

    if (currentSameDescriptionQuestion) {
      return res.status(400).json({ error: 'Question with an identical description already exists.' });
    }
  }  

  try {
    question.title = title;
    question.description = description;
    question.complexity = complexity;
    question.category = category;
    
    const updatedQuestion = await question.save();
    res.status(200).json(updatedQuestion);
  } catch (error) {
    if (!title || !description || !complexity || !category) {
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
    createQuestion,
    updateQuestion,
    deleteQuestion,
    addUserTag,
    deleteUserTag
  }