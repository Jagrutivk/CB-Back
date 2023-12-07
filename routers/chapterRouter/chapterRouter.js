// routes/chapterRoutes.js
const express = require('express');
const router = express.Router();
const chapterController = require('../../controllers/chapterController/chapterController');

// Create a new chapter
router.post('/chapters', chapterController.createChapter);

// Retrieve a chapter by ID
router.get('/chapters/:chapterId', chapterController.getChapterById);

// Update a chapter by ID
router.put('/chapters/:chapterId', chapterController.updateChapter);

// Delete a chapter by ID
router.delete('/chapters/:chapterId', chapterController.deleteChapter);

// Retrieve all chapters
router.get('/chapters', chapterController.getAllChapters);

module.exports = router;
