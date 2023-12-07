// controllers/ChapterController.js
const Chapter = require('../../models/chapterModel/chapterModel');
const Helper = require('../../utils/Helper')

// Create a new chapter
exports.createChapter = [Helper.verifyJWTtoken ,(req, res) => {
  const chapterData = req.body;
  Chapter.createChapter(chapterData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json({ message: 'Chapter created successfully', result });
  });
}];

// Retrieve a chapter by ID
exports.getChapterById = [Helper.verifyJWTtoken ,(req, res) => {
  const chapterId = req.params.chapterId;
  Chapter.getChapterById(chapterId, (err, result) => {
    if (err) {
      return res.status(404).json({ error: err });
    }
    return res.json(result);
  });
}];

// Update a chapter by ID
exports.updateChapter = [Helper.verifyJWTtoken ,(req, res) => {
  const chapterId = req.params.chapterId;
  const updatedData = req.body;
  Chapter.updateChapter(chapterId, updatedData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json({ message: 'Chapter updated successfully', result });
  });
}];

// Delete a chapter by ID
exports.deleteChapter =[ Helper.verifyJWTtoken ,(req, res) => {
  const chapterId = req.params.chapterId;
  Chapter.deleteChapter(chapterId, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json({ message: 'Chapter deleted successfully', result });
  });
}];

// Retrieve all chapters
exports.getAllChapters = (req, res) => {
  Chapter.getAllChapters((err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json(result);
  });
};
