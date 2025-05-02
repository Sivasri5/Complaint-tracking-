const express = require('express');
const router = express.Router();
const {
    createUser,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    blockUser,
    unblockUser
} = require('../controllers/user.controller');

// Create a user
router.post('/', createUser);

// Get all users
router.get('/', getUsers);

// Get a user by ID
router.get('/:id', getUserById);

// Update user details
router.put('/:id', updateUser);

// Delete a user (soft delete)
router.delete('/:id', deleteUser);

// Block a user
router.patch('/:id/block', blockUser);

// Unblock a user
router.patch('/:id/unblock', unblockUser);

module.exports = router;
