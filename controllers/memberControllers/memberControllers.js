const memberModel = require('../../models/memberModel/memberModel');
const sendEmailNotification = require("../../models/notificationModel/notificationModel");
const Helper = require('../../utils/Helper')

// Create a new member
exports.createMember = (req, res) => {
  const requestData = req.body; // Assuming the request contains the necessary data

  memberModel.createMember(requestData, (error, result) => {
    if (error) {
      // Handle the error appropriately, e.g., send an error response
      res.status(500).json({ error: error });
    } else {
      let shouldSendEmail = true;
      const recipient = result.email_id; // use the email from the login
      const ccRecipient = [result.email_id];
      const subject = "Membership Request accepted " + result.user_name + " !";
      const emailTemplate = `
Hello ${result.user_name},

Membership Request accepted
here are login credentials:
User ID: ${result.email_id}
Password: ${result.password}

With warm regards,
[My Health Saver]

Note: This email is intended solely for the named recipient and may contain confidential or privileged information. If you have received this email in error, please notify us immediately and delete it from your system.`;
      sendEmailNotification(shouldSendEmail, recipient, ccRecipient, subject, emailTemplate);
      // Member created successfully, send a success response
      res.status(201).json({ message: 'Member created successfully', result });
    }
  });
};


// Update a member in the members table
exports.updateMember = [Helper.verifyJWTtoken, (req, res) => {
  const member_id = req.params.member_idid; // Get the member ID from the request parameters
  const updatedData = req.body; // Updated member data from the request body

  memberModel.updateMember(member_id, updatedData, updated_by, (error) => {
    if (error) {
      res.status(500).json({ error: 'Failed to update the member' });
    } else {
      res.status(200).json({ message: 'Member updated successfully' });
    }
  });
}];

// get the membership request status
exports.getMembershipRequestStatus = [Helper.verifyJWTtoken, (req, res) => {
  const requestId = req.params.member_req_id;

  memberModel.getMembershipRequestStatus(requestId, (error, result) => {
    if (error) {
      res.status(500).json({ error: 'Error getting membership request Status' });
    } else {
      res.status(200).json({ message: 'getting membership request Status successfully', result });
    }
  });
}];

// Get a member by ID//
exports.getMemberById = [Helper.verifyJWTtoken, (req, res) => {
  const requestId = req.params.member_id;

  memberModel.getMemberById(requestId, (error, result) => {
    if (error) {
      console.log(error);
      res.status(500).json({ error: error });
    } else {
      res.status(200).json({ message: 'getting membership Details successfully', result });
    }
  });
}];

//get all members list
exports.getAllMembers = [Helper.verifyJWTtoken, (req, res) => {
  memberModel.getAllMembers((error, results) => {
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json({ requests: results });
  });
}];

//get  members all data by frist name for search 
exports.getMembersBySearch = [(req, res) => {
  const { first_name, last_name } = req.body;
  console.log(first_name);
  memberModel.getMembersBySearch(first_name, last_name, (error, results) => {
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json({ requests: results });
  });
}];

// delete the member record
exports.deleteMember = [Helper.verifyJWTtoken, (req, res) => {
  const requestId = req.params.member_req_id;

  memberModel.deleteMember(requestId, (error, results) => {
    if (error) {
      return res.status(500).json({ message: error });
    }
    return res.status(200).json({ message: 'Member deleted' });
  });
}];
// exports.updateMember = (req, res) => {
//     const member_id = req.params.id;
//     const updatedData = req.body; // Assuming the request body contains updated member data
//     // const imageFile = req.file; // Assuming you are using middleware for file uploads

//     // Handle the image file here, e.g., store it in a location and save the file path in the database

//     // Update the member's data in the database
//     memberModel.updateMember(member_id, updatedData, (error) => {
//       if (error) {
//         // Handle the error, e.g., send an error response
//         res.status(500).json({ error: 'Failed to update the member' });
//       } else {
//         // Send a success response
//         res.status(200).json({ message: 'Member updated successfully' });
//       }
//     });
//   };


// You can also add other controller functions as needed, e.g., getMember, updateMember, deleteMember, etc.


// Update a members personal details
exports.updateMemberPersonal = (req, res) => {
  const member_id = req.params.member_idid; // Get the member ID from the request parameters
  console.log("req.params-->", req.params)
  const updatedPersonalData = req.body; // Updated member data from the request body
  console.log("rreq.body-->", req.body)
  memberModel.updateMemberPersonal(member_id, (error) => {
    if (error) {
      res.status(500).json({ error: 'Failed to update the member' });
    } else {
      res.status(200).json({ message: 'Member updated successfully' });
    }
  });
};
