const express = require('express');
const router = express.Router();

const referralController = require('../../controllers/refferalController/refferalController')



//to create new refferal
router.post('/create-referral', referralController.createReferral);


// to get list of refferals
router.get('/get-referrals', referralController.getReferrals);


// get referral with specific id
router.get('/get-referral/:referral_id', referralController.getReferral);

// get referrals for me
router.get('/get-referralForMe/:referrerID', referralController.getReferralForMe);



// get referrals By me
router.get('/get-referralByMe/:referrerID', referralController.getReferralByMe);






module.exports = router;