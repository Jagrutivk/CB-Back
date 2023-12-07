const MembershipPlanModel = require('../../models/membershipPlanModel/membershipPlanModel');
const Helper = require('../../utils/Helper')

exports.createMembershipPlan = [ Helper.verifyJWTtoken,(req, res) => {
  const planData = req.body;
  MembershipPlanModel.createMembershipPlan(planData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json({ message: 'Membership plan created successfully', result });
  });
}];

exports.getMembershipPlanById = [ Helper.verifyJWTtoken, (req, res) => {
  const membership_plan = req.params.membership_plan;
  MembershipPlanModel.getMembershipPlanById(membership_plan, (err, result) => {
    if (err) {
      return res.status(404).json({ error: err });
    }
    return res.json(result);
  });
}];

exports.updateMembershipPlan = [ Helper.verifyJWTtoken, (req, res) => {
  const membership_plan = req.params.membership_plan;
  const updatedData = req.body;
  MembershipPlanModel.updateMembershipPlan(membership_plan, updatedData, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json({ message: 'Membership plan updated successfully', result });
  });
}];

exports.deleteMembershipPlan = [ Helper.verifyJWTtoken, (req, res) => {
  const membership_plan = req.params.membership_plan;
  MembershipPlanModel.deleteMembershipPlan(membership_plan, (err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json({ message: 'Membership plan deleted successfully', result });
  });
}];

exports.getAllMembershipPlans = (req, res) => {
  MembershipPlanModel.getAllMembershipPlans((err, result) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    return res.json(result);
  });
};
