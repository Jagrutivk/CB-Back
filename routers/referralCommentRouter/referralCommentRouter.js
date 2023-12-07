const express = require('express');
const router = express.Router();


const referralCommentController = require('../../controllers/referralCommentController/referralCommentController')


//to create new refferal comment
router.post('/create-referralComment', referralCommentController.createReferralComment);

// to get list of refferal comments
router.get('/get-referralComments', referralCommentController.getReferralComments);

// to delete particular referral comment

router.delete('/delete-referralComment/:refer_comment_id', referralCommentController.deleteReferralComment)


module.exports = router;
