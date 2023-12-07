const db = require('../config'); // Import your MySQL connection

const memberCategory = {};

// Create a member category
memberCategory.createMemberCategory = (categoryData, callback) => {
  const query = 'INSERT INTO member_category (member_category, category_desc, created_by, created_on, is_delete) VALUES (?, ?, ?, NOW(), false)';

  const values = [
    categoryData.member_category,
    categoryData.category_desc,
    categoryData.created_by
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Get a member category by ID
memberCategory.getMemberCategoryById = (categoryId, callback) => {
  const query = 'SELECT * FROM member_category WHERE member_category = ?';

  db.query(query, [categoryId], (err, result) => {
    if (err) {
      return callback(err, null);
    }

    if (result.length === 0) {
      return callback('Member category not found', null);
    }

    return callback(null, result[0]);
  });
};

// Update a member category by ID
memberCategory.updateMemberCategory = (categoryId, updatedData, callback) => {
  const query = 'UPDATE member_category SET member_category = ?, category_desc = ?, updated_by = ?, updated_on = NOW() WHERE member_category = ?';

  const values = [
    updatedData.category_desc,
    updatedData.updated_by,
    categoryId
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Delete a member category by ID
memberCategory.deleteMemberCategory = (categoryId, callback) => {
  const query = 'UPDATE member_category SET is_delete = true WHERE member_category = ?';

  db.query(query, [categoryId], (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });
};

// Retrieve all member categories
memberCategory.getAllMemberCategories = (callback) => {
  const query = 'SELECT * FROM member_category WHERE is_delete = false';

  db.query(query, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });
};

module.exports = memberCategory;
