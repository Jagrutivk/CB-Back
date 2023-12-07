const commentMeeting = require('../../models/meetingCommentModel/meetingCommentModel');




// Create a  meeting comment
exports.createMeetingComment = (req, res) => {
    const commmentData = req.body;
    commentMeeting.createMeeting(commmentData, (err, result) => {
      if (err) {
        res.status(400).json({ message: 'Failed to add meeting comment' });
      } else {
        res.status(201).json({ message: 'comment added  successfully' });
      }
    });
  };
  

  