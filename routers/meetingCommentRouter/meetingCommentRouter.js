const express = require('express');
const router = express.Router();

const meetingCommentController = require('../../controllers/meetingCommentController/meetingCommentController');



// Create a meeting comment

router.post('/meeting-comment', meetingCommentController.createMeetingComment);

module.exports = router;