const express = require('express');
const router = express.Router();
const MembershipRequestController = require('../../controllers/membershipRequestController/membershipRequestController');
const csrf_mid = require('../middleware/csrf_mid')

// router.use(csrf_mid.csrfProtection)

// Create a new membership request
router.post('/membership-requests', MembershipRequestController.createMembershipRequest);

// Get a specific membership request by ID
router.get('/membership-requests/:member_req_id', MembershipRequestController.getMembershipRequestById);

// Update a specific membership request by ID
router.put('/membership-requests/:member_req_id', MembershipRequestController.updateMembershipRequest);

// Delete a specific membership request by ID
router.delete('/membership-requests/:member_req_id', MembershipRequestController.deleteMembershipRequest);

// Get a list of all membership requests
router.get('/membership-requests', MembershipRequestController.listAllMembershipRequests);

// to validate email while signup form

router.get('/checkEmailUniqueness', MembershipRequestController.checkEmailUniqueness)


module.exports = router;
