const pool = require('../config'); // Require your MySQL connection pool






const referralComment = {

  // to create new refferal

  createReferralComment : ( referralCommentData, callback)=>{
    referralCommentData
            pool.query('INSERT INTO referral_comments SET ?', referralCommentData, (error, results) => {
                if (error) {
                  return callback(error);
                }
                return callback(null, results);
              });
        
    
        },

           // to ger list of all referral cpmments

    getReferralComments : (callback)=>{
        pool.query('SELECT * FROM referral_comments',  (error, results) => {
            if (error) {
              return callback(error);
            }
            return callback(null, results);
          });

    },

    // to delete particulat referral comment

    deleteReferralComment : (refer_comment_id ,callback)=>{
       
        pool.query('DELETE FROM referral_comments WHERE refer_comment_id=?', [refer_comment_id] ,(error, results) => {
            if (error) {
              return callback(error);
            }
            return callback(null, results);
          });

    }


};

module.exports = referralComment;