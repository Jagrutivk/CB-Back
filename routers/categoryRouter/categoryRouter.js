const express = require('express');
const router = express.Router();

const categoryController = require('../../controllers/categoryController/categoryController')



// Retrieve all categories
router.get('/get-categories', categoryController.getCategories);

module.exports = router;