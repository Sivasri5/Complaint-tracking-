const express = require('express');
const router = express.Router();
const {
    createComplaint,
    getComplaints,
    getComplaintById,
    updateComplaint,
    deleteComplaint
} = require('../controllers/complaint.controller');

// Create a complaint
router.post('/', createComplaint);

// Get all complaints
router.get('/', getComplaints);

// Get a complaint by ID
router.get('/:id', getComplaintById);

// Update a complaint
router.put('/:id', updateComplaint);

// Soft delete a complaint
router.delete('/:id', deleteComplaint);

module.exports = router;
