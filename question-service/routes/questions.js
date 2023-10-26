const express = require('express')
const { 
  createQuestion,
  getAllQuestions,
  deleteQuestion,
  updateQuestion,
  addUserTag,
  deleteUserTag
} = require('../controllers/questionController')
const router = express.Router()

// GET, POST, DELETE, UPDATE questions
router.get('/', getAllQuestions)
router.post('/', createQuestion)
router.delete('/:id', deleteQuestion)
router.patch('/:id', updateQuestion)

// UPDATE, DELETE tags
router.patch('/:id/tags', addUserTag)
router.delete('/:id/tags', deleteUserTag)

module.exports = router