const express = require('express');
const router = express.Router();

const meetingController = require('../../controllers/meetingController/meetingController')


//create new meeting

router.post('/create-meeting', meetingController.createMeeting);

// update meeting information

router.put('/update-meeting', meetingController.updateMeeting);

// to delete scheduled meeting
router.delete('/delete-meeting/:meeting_id', meetingController.deleteMeeting);

// list of meetings

router.get('/get-meetings', meetingController.getMeetings);

// meeting details with specific id
router.get('/get-meeting/:userID', meetingController.getMeeting);




module.exports = router;