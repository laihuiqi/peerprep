const express = require('express')
const { 
  createQuestion,
  getAllQuestions,
  getQuestion,
  getMatchQuestion,
  deleteQuestion,
  updateQuestion,
  addUserTag,
  deleteUserTag
} = require('../controllers/questionController')
const router = express.Router()

// GET, POST, DELETE, UPDATE questions
router.get('/', getAllQuestions)
router.get('/:id', getQuestion) 
router.post('/', createQuestion)
router.post('/match', getMatchQuestion)
router.delete('/:id', deleteQuestion)
router.patch('/:id', updateQuestion)

// UPDATE, DELETE tags
router.patch('/:id/tags', addUserTag)
router.delete('/:id/tags', deleteUserTag)

module.exports = router