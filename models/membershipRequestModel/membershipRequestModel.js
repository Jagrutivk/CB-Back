const pool = require('../config'); // Require your MySQL connection pool

const MembershipRequest = {
  createMembershipRequest: (requestData, callback) => {
    pool.query('INSERT INTO membership_request SET ?', requestData, (error, results) => {
      if (error) {
        return callback(error);
      }
      

      const selectQuery = `SELECT m.member_id , m.email_id
      FROM cb_project.members AS m
      LEFT JOIN cb_project.membership_detail AS md ON m.member_id = md.member_id
      LEFT JOIN cb_project.user AS u ON m.member_id = u.member_id
      LEFT JOIN cb_project.role AS r ON u.role_id = r.role_id
      WHERE m.is_delete = false and r.role_name="ADMIN"
      ORDER BY m.member_id DESC;
  `;

      pool.query(selectQuery, (error, results) => {
        if (error) {
          return callback(error, null);
        } else {
          if (results.length === 0) {
            return callback('No Members found', null);
          }
          return callback(null, results);
        }
      });
    });
  },

  getMembershipRequestById: (requestId, callback) => {
    pool.query('SELECT * FROM membership_request WHERE member_req_id = ?', [requestId], (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results[0]);
    });
  },

  updateMembershipRequest: (member_req_id, review_comment, callback) => {
    const updateQuery = 'UPDATE membership_request SET membership_status = ?, review_comment = ? WHERE member_req_id = ?';
    const updateValues = ['Rejected', review_comment, member_req_id];

    pool.query(updateQuery, updateValues, (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  },

  // deleteMembershipRequest: (requestId, callback) => {
  //   pool.query('DELETE FROM membership_request WHERE member_req_id = ?', [requestId], (error, results) => {
  //     if (error) {
  //       return callback(error);
  //     }
  //     return callback(null, results);
  //   });
  // },
  deleteMembershipRequest: (requestId, callback) => {
    // Instead of deleting the record, update is_deleted to true
    const updateQuery = 'UPDATE membership_request SET is_delete = true WHERE member_req_id = ?';

    pool.query(updateQuery, [requestId], (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  },

  getAllMembershipRequests: (callback) => {
    pool.query('SELECT * FROM membership_request WHERE is_delete = false ORDER BY member_req_id DESC', (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  },


  // to validate email while signup form
  getAllMemberEmails: (email, callback) => {
    console.log('email',email)
    pool.query('SELECT * FROM membership_request WHERE email_id = ?', [email], (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  },
  
  
};




module.exports = MembershipRequest;




