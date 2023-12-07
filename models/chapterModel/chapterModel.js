// models/Chapter.js
const db = require('../config'); // Import your MySQL connection

const Chapter = {

createChapter : (chapterData, callback) => {
  const query = 'INSERT INTO chapter (chapter_name, email_id, phone_no, no_of_members, chapter_desc, street_address, city, state, country, zip_code, created_by, created_on, is_delete) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), false)';

  const values = [
    chapterData.chapter_name,
    chapterData.email_id,
    chapterData.phone_no,
    chapterData.no_of_members,
    chapterData.chapter_desc,
    chapterData.street_address,
    chapterData.city,
    chapterData.state,
    chapterData.country,
    chapterData.zip_code,
    chapterData.created_by,
    chapterData.is_delete
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      return callback(err, null);
    }
    return callback(null, result);
  });
} ,

getChapterById : (chapterId, callback) => {
  const query = 'SELECT * FROM chapter WHERE chapter_id = ?';

  db.query(query, [chapterId], (err, result) => {
    if (err) {
      return callback(err, null);
    }

    if (result.length === 0) {
      return callback('Chapter not found', null);
    }

    return callback(null, result[0]);
  });
},

// Update a chapter by ID
updateChapter : (chapterId, updatedData, callback) => {
    const query = 'UPDATE chapter SET chapter_name = ?, email_id = ?, phone_no = ?, no_of_members = ?, chapter_desc = ?, street_address = ?, city = ?, state = ?, country = ?, zip_code = ?, updated_by = ?, updated_on = NOW() WHERE chapter_id = ?';
  
    const values = [
      updatedData.chapter_name,
      updatedData.email_id,
      updatedData.phone_no,
      updatedData.no_of_members,
      updatedData.chapter_desc,
      updatedData.street_address,
      updatedData.city,
      updatedData.state,
      updatedData.country,
      updatedData.zip_code,
      updatedData.updated_by,
      chapterId
    ];
  
    db.query(query, values, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  },
  
  // Delete a chapter by ID
deleteChapter : (chapterId, callback) => {
    const query = 'UPDATE chapter SET is_delete = true WHERE chapter_id = ?';
  
    db.query(query, [chapterId], (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  },
  
  // Retrieve all chapters
  getAllChapters : (callback) => {
    const query = 'SELECT * FROM chapter';
  
    db.query(query, (err, result) => {
      if (err) {
        return callback(err, null);
      }
      return callback(null, result);
    });
  },
}
  
module.exports = Chapter;
