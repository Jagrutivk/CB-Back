const express = require('express');
const memberController = require('../../controllers/memberControllers/memberControllers');

const router = express.Router();

// Create a new member
router.post('/members', memberController.createMember);

// Update a member
router.put('/members/:member_id', memberController.updateMember);

// Get membership request status
router.get('/members/status/:member_req_id', memberController.getMembershipRequestStatus);

// Get a member by ID
router.get('/members/:member_id', memberController.getMemberById);

// Get all members
router.get('/members', memberController.getAllMembers);
//search for member by name 
router.post('/members/search', memberController.getMembersBySearch);
// router.put('/:id', upload.single('image'), memberController.updateMember);
// Delete a member by ID
router.delete('/members/:id', memberController.deleteMember);

// to update members personal details
router.put('/member/update/:id', memberController.updateMemberPersonal);


module.exports = router;
