


const referralCommentModel = require('../../models/referralCommentModel/referralCommentModel')




exports.createReferralComment = (req, res) => {
    const referralCommentData = req.body;
    referralCommentModel.createReferralComment(referralCommentData, (error, results) => {
      if (error) {
          console.log(error)
        return res.status(500).json({ message: 'Error creating refferal comment' });
      }
      return res.status(201).json({ message: 'refferal comment created', results });
    });


  };


   // to get the list of all refferals

   exports.getReferralComments = (req, res) => {
   
    referralCommentModel.getReferralComments( (error, results) => {
      if (error) {
          console.log(error)
        return res.status(500).json({ message: 'error in getting list of referral comments' });
      }
      return res.status(201).json({ message: 'refferal comments list', results });
    });

  };


  // to DELETE the particular referral comment

  exports.deleteReferralComment = (req, res) => {
    const refer_comment_id = req.params.refer_comment_id;

    console.log('------>',refer_comment_id)
   
    referralCommentModel.deleteReferralComment(refer_comment_id, (error, results) => {
      if (error) {
          console.log(error)
        return res.status(500).json({ message: 'error in getting list of referral comments' });
      }
      return res.status(201).json({ message: 'refferal comments list', results });
    });

  };
