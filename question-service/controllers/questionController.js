const Question = require('../models/questionModel')
const mongoose = require('mongoose')

const getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find({}).sort({createdAt: -1})
        res.status(200).json(questions)
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving questions'});
    }
};
  
const createQuestion = async (req, res) => {
    const {title, description, complexity, category} = req.body
    try {
      const question = await Question.create({title, description, complexity, category})
      res.status(200).json(question)
    } catch (error) {
      res.status(400).json({error: error.message})
    }
    res.json({msg: 'Create a new question'})
};

const updateQuestion = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'Question does not exist'})
    }
    const question = await Question.findOneAndUpdate({_id: id}, {...req.body} , {
        new: true,
    })
    if (!question) {
      return res.status(400).json({error: 'Question does not exist'})
    }
  
    res.status(200).json(question)
};

const deleteQuestion = async (req, res) => {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({error: 'Question does not exist'})
    }
    const question = await Question.findOneAndDelete({_id: id})
    if(!question) {
      return res.status(400).json({error: 'Question does not exist'})
    }
  
    res.status(200).json(question)
};
  
  module.exports = {
    getAllQuestions,
    createQuestion,
    updateQuestion,
    deleteQuestion,
  };