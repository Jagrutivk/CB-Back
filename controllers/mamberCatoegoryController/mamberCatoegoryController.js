const memberCategory = require('../../models/mamberCatoegoryModel/mamberCatoegoryModel');
const Helper = require('../../utils/Helper');

// Create a member category
const createMemberCategory = [Helper.verifyJWTtoken ,(req, res) => {
  const categoryData = req.body;
  memberCategory.createMemberCategory(categoryData, (err, result) => {
    if (err) {
      res.status(400).json({ message: 'Failed to create member category' });
    } else {
      res.status(201).json({ message: 'Member category created successfully' });
    }
  });
}];

// Get a member category by ID
const getMemberCategoryById = [Helper.verifyJWTtoken ,(req, res) => {
  const categoryId = req.params.id;
  memberCategory.getMemberCategoryById(categoryId, (err, result) => {
    if (err) {
      res.status(400).json({ message: 'Failed to fetch member category' });
    } else {
      res.status(200).json(result);
    }
  });
}];

// Update a member category by ID
const updateMemberCategory = [Helper.verifyJWTtoken ,(req, res) => {
  const categoryId = req.params.id;
  const updatedData = req.body;
  memberCategory.updateMemberCategory(categoryId, updatedData, (err, result) => {
    if (err) {
      res.status(400).json({ message: 'Failed to update member category' });
    } else {
      res.status(200).json({ message: 'Member category updated successfully' });
    }
  });
}];

// Delete a member category by ID
const deleteMemberCategory =[Helper.verifyJWTtoken , (req, res) => {
  const categoryId = req.params.id;
  memberCategory.deleteMemberCategory(categoryId, (err, result) => {
    if (err) {
      res.status(400).json({ message: 'Failed to delete member category' });
    } else {
      res.status(200).json({ message: 'Member category deleted successfully' });
    }
  });
}];

// Get all member categories
const getAllMemberCategories = (req, res) => {
  memberCategory.getAllMemberCategories((err, result) => {
    if (err) {
      res.status(400).json({ message: 'Failed to fetch member categories' });
    } else {
      res.status(200).json(result);
    }
  });
}

module.exports = {
  createMemberCategory,
  getMemberCategoryById,
  updateMemberCategory,
  deleteMemberCategory,
  getAllMemberCategories,
};
