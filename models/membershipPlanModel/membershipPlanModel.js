const pool = require('../config'); // Import your MySQL pool

const MembershipPlanModel = {
  // Create a new membership plan
  createMembershipPlan: (planData, callback) => {
    const insertQuery = 'INSERT INTO membership_plan (membership_plan, plan_desc, fee, membership_benefits, created_by, created_on, is_delete) VALUES (?, ?, ?, ?, ?, NOW(), ?)';

    pool.query(insertQuery, [planData.membership_plan, planData.plan_desc, planData.fee, planData.membership_benefits, planData.created_by, planData.updated_by, false], (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  },

  // Retrieve a membership plan by ID
  getMembershipPlanById: (membership_plan, callback) => {
    const selectQuery = 'SELECT * FROM membership_plan WHERE membership_plan = ?';

    pool.query(selectQuery, [membership_plan], (error, results) => {
      if (error) {
        return callback(error, null);
      }

      if (results.length === 0) {
        return callback('Membership plan not found', null);
      }

      const membershipPlan = results[0];
      return callback(null, membershipPlan);
    });
  },

  // Update a membership plan
  updateMembershipPlan: (membership_plan, updatedData, callback) => {
    const updateQuery = 'UPDATE membership_plan SET plan_desc = ?, fee = ?, membership_benefits = ?, updated_on = NOW() WHERE membership_plan = ?';

    pool.query(updateQuery, [updatedData.plan_desc, updatedData.fee, updatedData.membership_benefits, updatedData.updated_by,membership_plan], (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  },

  // Delete a membership plan
  deleteMembershipPlan: (membership_plan, callback) => {
    const deleteQuery = 'UPDATE membership_plan SET is_delete = true, WHERE membership_plan = ?';

    pool.query(deleteQuery, [membership_plan], (error, results) => {
      if (error) {
        return callback(error);
      }
      return callback(null, results);
    });
  },

  // Retrieve all membership plans
  getAllMembershipPlans: (callback) => {
    const selectQuery = 'SELECT * FROM membership_plan WHERE is_delete = false';

    pool.query(selectQuery, (error, results) => {
      if (error) {
        return callback(error, null);
      }
      return callback(null, results);
    });
  },
};

module.exports = MembershipPlanModel;
