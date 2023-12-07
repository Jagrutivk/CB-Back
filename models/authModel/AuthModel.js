// const Model = require("../Model");
const pool = require('../config'); // Require your MySQL connection pool

class AuthModel {
  //get the user details by Email
    getUserByEmail = async ( email_id, callback) => {
        let sql = `SELECT m.member_id,m.email_id, u.password, u.user_name, r.role_name
        FROM cb_project.user u
        JOIN cb_project.members m ON u.member_id = m.member_id
        JOIN cb_project.role r ON u.role_id = r.role_id
        WHERE m.email_id =  ?`;
        pool.query(sql, [email_id], (error, results) => {
            if (error) {
              return callback(error);
            }
            return callback(null, results);
          });
    }

    updatePassword = async(email_id, password, callback) => {
      const sql = 'UPDATE user SET password = ? WHERE member_id = (SELECT member_id FROM members WHERE email_id = ?)';
      pool.query(sql, [password, email_id], (err) => {
          if (err) {
              console.error("Error while updating password:", err);
              return callback(err, null);
          } else {
              console.log("Password updated successfully !!!");
              return callback(null, "Password updated successfully !!!");
          }
      });
  };
}

module.exports = AuthModel