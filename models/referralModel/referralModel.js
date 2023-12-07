const pool = require('../config'); // Require your MySQL connection pool


const referral = {


  // to create new refferal

  createReferral: (referralData, callback) => {
    let referralId;
    pool.query('INSERT INTO referral SET ?', referralData, (error, results) => {
        if (error) {
            return callback(error);
        }
        referralId = results.insertId;
        getReferredData(referralData.referred_by, referralData.referred_to, (referredByData, referredToData, error) => {
            if (error) {
                return callback(error);
            }
            return callback(null, { referralId, referredByData, referredToData });
        });
    });

    function getReferredData(referredBy, referredTo, callback) {
        let referredByData, referredToData;
        pool.query('SELECT * FROM members WHERE member_id = ?', referredBy, (error, results) => {
            if (error) {
                return callback(null, null, error);
            }
            referredByData = results[0];
            pool.query('SELECT * FROM members WHERE member_id = ?', referredTo, (error, results) => {
                if (error) {
                    return callback(null, null, error);
                }
                referredToData = results[0];
                callback(referredByData, referredToData, null);
            });
        });
    }
},




  // to ger list of all referrals

  getReferrals: (callback) => {
    pool.query('SELECT referral.*, referredBy.first_name AS referred_by_name, referredTo.first_name AS referred_to_name FROM referral ' +
      'LEFT JOIN members AS referredBy ON referral.referred_by = referredBy.member_id ' +
      'LEFT JOIN members AS referredTo ON referral.referred_to = referredTo.member_id', (error, results) => {
        if (error) {
          return callback(error);
        }
        return callback(null, results);
      });
  },



  // to get referrals with specific id

  getReferral: (referralID, callback) => {
    pool.query('SELECT * FROM referral WHERE referral_id = ?', [referralID], (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });

  }
  ,

  // referral for me 
  //  here referred to id = logged in memberID , so that he will get list of referrals referred to him
  getReferralForMe: (referred_to, callback) => {
    console.log("referred to id", referred_to)
    pool.query(`SELECT
    r.*,
    referred_by_member.first_name AS referred_by_first_name,
    referred_to_member.first_name AS referred_to_first_name
FROM
    referral AS r
JOIN
    members AS referred_by_member
ON
    r.referred_by = referred_by_member.member_id
JOIN
    members AS referred_to_member
ON
    r.referred_to = referred_to_member.member_id
WHERE
    r.referred_to = ?`, [referred_to], (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });

  },


  // referral by me 
  // IN both api we use logged in memberID , in case of referredBy and referredTO 
  getReferralByMe: (referred_by, callback) => {
    console.log("id--->", referred_by)
    pool.query(`SELECT
    r.*,
    referred_by_member.first_name AS referred_by_first_name,
    referred_to_member.first_name AS referred_to_first_name
FROM
    referral AS r
JOIN
    members AS referred_by_member
ON
    r.referred_by = referred_by_member.member_id
JOIN
    members AS referred_to_member
ON
    r.referred_to = referred_to_member.member_id
WHERE
    r.referred_by = ?
`, [referred_by], (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });

  }




}



module.exports = referral;