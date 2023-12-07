// models/Chapter.js
const db = require('../config'); // Import your MySQL connection

const category = {};


// Retrieve all category
category.getCategories = (callback) => {
    const query = 'SELECT * FROM category';
  
    db.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  };

module.exports = category;