const MembershipRequestModel = require('../../models/membershipRequestModel/membershipRequestModel');
const Helper = require('../../utils/Helper')
const sendEmailNotification = require("../../models/notificationModel/notificationModel");


exports.createMembershipRequest = (req, res) => {
  const requestData = req.body;
  MembershipRequestModel.createMembershipRequest(requestData, (error, results) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error creating membership request' });
    }
    // sending email notification
    let shouldSendEmail = true;
   const recipient = requestData.email_id; // Email of the admin
   const ccRecipient=[results[0].email_id];
   const subject = `Successfully Created Membership Request for ${requestData.first_name}!`;
         
    const emailTemplate = `Hello ${requestData.first_name},

    Congratulations! Your membership request has been successfully created.

    Details:
     Membership Plan: ${requestData.membership_plan}
     Company Name: ${requestData.company_name}
     Member category: ${requestData.member_category}
     Contact No.: ${requestData.contact_no}

    Our team will review your request shortly. You will receive a confirmation email upon approval.

    With warm regards,
    [CB]

    Note: This email is intended solely for the named recipient and may contain confidential or privileged information. If you have received this email in error, please notify us immediately and delete it from your system.
  `;

    sendEmailNotification(shouldSendEmail, recipient, ccRecipient, subject, emailTemplate);
    return res.status(201).json({ message: 'Membership request created', results });
  });
};

exports.getMembershipRequestById = [Helper.verifyJWTtoken, (req, res) => {
  const requestId = req.params.member_req_id;
  MembershipRequestModel.getMembershipRequestById(requestId, (error, result) => {
    if (error) {
      return res.status(500).json({ message: 'Error getting membership request' });
    }
    return res.status(200).json({ request: result });
  });
}];

exports.updateMembershipRequest = [Helper.verifyJWTtoken, (req, res) => {
  const member_req_id = req.params.member_req_id;
  const review_comment = req.body.comment;
  MembershipRequestModel.updateMembershipRequest(member_req_id, review_comment, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error updating membership request' });
    }
    return res.status(200).json({ message: 'Membership request updated', results });
  });
}];

exports.deleteMembershipRequest = [Helper.verifyJWTtoken, (req, res) => {
  const requestId = req.params.member_req_id;
  MembershipRequestModel.deleteMembershipRequest(requestId, (error, results) => {
    if (error) {
      return res.status(500).json({ message: 'Error deleting membership request' });
    }
    return res.status(200).json({ message: 'Membership request deleted' });
  });
}];


exports.listAllMembershipRequests = [Helper.verifyJWTtoken ,(req, res) => {
    MembershipRequestModel.getAllMembershipRequests((error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error listing membership requests' });
      }
      return res.status(200).json({ requests: results });
    });
  }];


  // api to validate email while signup form

  exports.checkEmailUniqueness = (req, res) => {
    const { email_id } = req.query;
    MembershipRequestModel.getAllMemberEmails(email_id, (error, results) => {
      if (error) {
        return res.status(500).json({ message: 'Error in checking email uniqueness' });
      }
  
      const isUnique = results.length === 0;
      return res.status(200).json({ unique: isUnique });
    });
  };
  
