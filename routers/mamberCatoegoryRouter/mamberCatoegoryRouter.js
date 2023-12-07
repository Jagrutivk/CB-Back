const express = require('express');
const router = express.Router();
const memberCategoryController = require('../../controllers/mamberCatoegoryController/mamberCatoegoryController');

// Create a member category
router.post('/memberCategory', memberCategoryController.createMemberCategory);

// Get a member category by ID
router.get('/memberCategory/:id', memberCategoryController.getMemberCategoryById);

// Update a member category by ID
router.put('/memberCategory/:id', memberCategoryController.updateMemberCategory);

// Delete a member category by ID
router.delete('/memberCategory/:id', memberCategoryController.deleteMemberCategory);

// Get all member categories
router.get('/memberCategory', memberCategoryController.getAllMemberCategories);

module.exports = router;
