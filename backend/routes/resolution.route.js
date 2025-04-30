const express = require('express');
const router = express.Router();
const {
    createResolution,
    getResolutions,
    getResolutionById,
    updateResolution,
    closeResolution
} = require('../controllers/resolution.controller');

// Create a resolution
router.post('/', createResolution);

// Get all resolutions
router.get('/', getResolutions);

// Get a resolution by ID
router.get('/:id', getResolutionById);

// Update a resolution
router.put('/:id', updateResolution);

// Close a resolution (mark as closed)
router.patch('/:id/close', closeResolution);

module.exports = router;
