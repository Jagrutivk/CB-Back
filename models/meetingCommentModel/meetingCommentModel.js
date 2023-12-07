const pool = require('../config'); // Import your MySQL connection

;

// Create a member category
const meetingComment = {


    // to create new refferal
  
    createMeeting: (commentData, callback) => {
      
      pool.query('INSERT INTO meeting_comments SET ?', commentData, (error, results) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      });
  
  
    },

}

module.exports = meetingComment;