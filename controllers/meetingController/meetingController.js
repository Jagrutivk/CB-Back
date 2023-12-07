const meetingModel = require('../../models/meetingModel/meetingModel')
const sendEmailNotification = require("../../models/notificationModel/notificationModel");
// to create new meeting

exports.createMeeting = (req, res) => {
  const meetingData = req.body;
  meetingModel.createMeeting(meetingData, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error creating membership request' });
    }

    // Sending email notification
    let shouldSendEmail = true;
    const recipient = [results.meetingByData.email_id]; // Email of the referredTo
    const ccRecipient = [results.meetingToData.email_id]; // Email of the referredBy
    const subject = "Link of One One to meeting Created by  " + results.meetingByData.first_name + " !";

    // Modify the email template based on meeting type
    let emailTemplate = `
    Hello  ${results.meetingToData.first_name} and  ${results.meetingByData.first_name},

You have a one-on-one meeting scheduled.

Meeting Details:
Meeting Type: ${meetingData.meeting_type}
Meeting Date: ${meetingData.meeting_date}
Start Time: ${meetingData.meeting_start_time}
End Time: ${meetingData.meeting_end_time}
`;

    if (meetingData.meeting_type === 'Virtual') {
      emailTemplate += `Meeting Link: ${meetingData.meeting_link}\n`;
    } else if (meetingData.meeting_type === 'In-Person') {
      emailTemplate += `Meeting Place: ${meetingData.meeting_place}\n`;
    }

    emailTemplate += `
Meeting Subject: ${meetingData.meeting_subject}

Please join the meeting at the scheduled time using the provided ${meetingData.meeting_type === 'Virtual' ? 'meeting link' : 'meeting place'}.

With warm regards,
[CB]

Note: This email is intended solely for the named recipient and may contain confidential or privileged information. If you have received this email in error, please notify us immediately and delete it from your system.`;

    sendEmailNotification(shouldSendEmail, recipient, ccRecipient, subject, emailTemplate);

    // Meeting created successfully, send a success response
    res.status(201).json({ message: 'Meeting created', results });
  });
};




// to update meeting details

exports.updateMeeting = (req, res) => {
  const meetingData = req.body;
  meetingModel.createMeeting(meetingData, (error, results) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error in updating meeting data' });
    }
    return res.status(201).json({ message: 'Meeting data updated successfully ', results });
  });
};



// to delete meeting

exports.deleteMeeting = (req, res) => {
  const meetingID = req.prams;
  meetingModel.createMeeting(meetingID, (error, results) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error in deleting meeting data' });
    }
    return res.status(201).json({ message: 'Meeting deleted  successfully ', results });
  });
};


// to get details of all meetings


exports.getMeetings = (req, res) => {

  meetingModel.getMeetings((error, results) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error in fetching meeting data' });
    }
    return res.status(201).json({ message: 'Meetings fetched  successfully ', results });
  });

  //   const Result = {  message: 'successfully fetched all meetings'};
  //   return res.status(201).json(Result);
};


// to get meeting details with specific userID

exports.getMeeting = (req, res) => {
  const userID = req.params.userID;
  console.log('req.params-->', req.params)
  console.log('userID---->', userID)
  meetingModel.getMeeting(userID, (error, results) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error in fetching meeting data' });
    }
    return res.status(201).json({ message: 'Meeting fetched  successfully ', results });
  });
};
