const express = require('express')
const { 
  createQuestion,
  getAllQuestions,
  deleteQuestion,
  updateQuestion
} = require('../controllers/questionController')
const router = express.Router()

// GET all questions
router.get('/', getAllQuestions)

// POST a new question
router.post('/', createQuestion)

// DELETE a question
router.delete('/:id', deleteQuestion)

// UPDATE a question
router.patch('/:id', updateQuestion)

module.exports = router