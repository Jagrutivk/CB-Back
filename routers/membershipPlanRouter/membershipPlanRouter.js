const express = require('express');
const router = express.Router();
const membershipPlanController = require('../../controllers/membershipPlanController/membershipPlanController');

// Create a new membership plan
router.post('/membership_plans', membershipPlanController.createMembershipPlan);

// Retrieve a membership plan by ID
router.get('/membership_plans/:membership_plan', membershipPlanController.getMembershipPlanById);

// Update a membership plan by ID
router.put('/membership_plans/:membership_plan', membershipPlanController.updateMembershipPlan);

// Delete a membership plan by ID
router.delete('/membership_plans/:membership_plan', membershipPlanController.deleteMembershipPlan);

// Retrieve all membership plans
router.get('/membership_plans', membershipPlanController.getAllMembershipPlans);

module.exports = router;
