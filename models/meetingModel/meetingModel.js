const pool = require('../config'); // Require your MySQL connection pool


const meeting = {

  // to create a new meeting

  createMeeting: (meetingData, callback) => {
    pool.query('INSERT INTO one_on_one_meeting SET ?', meetingData, (error, results) => {
        if (error) {
            return callback(error);
        }
        let meeting_id = results.insertId;
        getMeetingData(meetingData.created_by, meetingData.members, (meetingByData, meetingToData, error) => {
            if (error) {
                return callback(error);
            }
            return callback(null, { meeting_id, meetingByData, meetingToData });
        });
    });

    function getMeetingData(created_by, members, callback) {
        let meetingByDataResult, meetingToDataResult;
        pool.query('SELECT * FROM members WHERE member_id = ?', created_by, (error, meetingByResults) => {
            if (error) {
                return callback(null, null, error);
            }
            meetingByDataResult = meetingByResults[0];
            pool.query('SELECT * FROM members WHERE member_id = ?', members, (error, meetingToResults) => {
                if (error) {
                    return callback(null, null, error);
                }
                meetingToDataResult = meetingToResults[0];
                callback(meetingByDataResult, meetingToDataResult, null);
            });
        });
    }
},



    // to update meeting information

    updateMeeting : (meetingData , callback)=>{

      pool.query('UPDATE  one_on_one_meeting SET ?', meetingData, (error, results) => {
          if (error) {
            return callback(error);
          }
          return callback(null, results);
        });
   },


   // to delete meeting

   deleteMeeting : (meetingID , callback)=>{

    pool.query('DELETE FROM one_on_one_meeting WHERE meeting_id = ?', meetingID, (error, results) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      });
 },

 // to get meeting data

 getMeetings : (callback)=>{

  pool.query('SELECT * FROM one_on_one_meeting ORDER BY meeting_date DESC ', (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
},

// meeting details with specific user id

getMeeting: (userID, callback) => {
  pool.query(
    `SELECT
    oom.*,
    creator.first_name AS creator_first_name,
    member.first_name AS member_first_name
FROM
    one_on_one_meeting AS oom
JOIN
    members AS creator
ON
    oom.created_by = creator.member_id
JOIN
    members AS member
ON
    oom.members = member.member_id
WHERE
    oom.created_by = ?`,
    [userID],
    (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    }
  );
}
,
    

}



module.exports = meeting;