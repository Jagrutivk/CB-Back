// controllers/ChapterController.js
const category = require('../../models/chapterModel/chapterModel');
const Helper = require('../../utils/Helper')



// Retrieve all chapters
exports.getCategories =[Helper.verifyJWTtoken ,(req, res) => {
    category.getCategories((err, result) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      return res.json(result);
    });
  }];
  