const express = require('express');
const router = express.Router();
const {
    createComment,
    getComments,
    getCommentById,
    updateComment,
    deleteComment
} = require('../controllers/comment.controller');

// Create a comment
router.post('/', createComment);

// Get all comments
router.get('/', getComments);

// Get a comment by ID
router.get('/:id', getCommentById);

// Update a comment
router.put('/:id', updateComment);

// Soft delete a comment
router.delete('/:id', deleteComment);

module.exports = router;
