const referralModel = require('../../models/referralModel/referralModel')
const sendEmailNotification = require("../../models/notificationModel/notificationModel");

// to create a new refferal

exports.createReferral = (req, res) => {
  const referralData = req.body;
  console.log(">>>>>>>>", referralData);
  referralModel.createReferral(referralData, (error, results) => {
    if (error) {
      console.log(error);
      return res.status(500).json({ message: 'Error creating referral' });
    }
    // const { referredByData, referredToData } = results;
    // sending email notification
    let shouldSendEmail = true;
    const recipient =[results.referredToData.email_id]; // Email of the referredTo
    const ccRecipient = [results.referredByData.email_id]; // Email of the referredBy
    const subject = "Send Referal details by  " + results.referredByData.first_name + " !";
    const emailTemplate = `
      Hello ${results.referredToData.first_name},

You have been referred by ${results.referredByData.first_name} to join our platform.

Referral Details:
Referrence Name: ${referralData.referrer_name}
Referrence company_name: ${referralData.company_name}
Referrence Email: ${referralData.email_id}
Referrence Contact No.: ${referralData.contact_no}



With warm regards,
[CB]

Note: This email is intended solely for the named recipient and may contain confidential or privileged information. If you have received this email in error, please notify us immediately and delete it from your system.`;

    sendEmailNotification(shouldSendEmail, recipient, ccRecipient, subject, emailTemplate);

    // Member created successfully, send a success response
    res.status(201).json({ message: 'Referral created', results });
  });
};



// to get the list of all refferals

exports.getReferrals = (req, res) => {

  referralModel.getReferrals((error, results) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ message: 'error in getting list of referrals' });
    }
    return res.status(201).json({ message: 'refferal list', results });
  });

  // const Result = {  message: 'successfully fetched list of refferals'};
  // return res.status(201).json(Result);
};



// to get refferal with specific id

exports.getReferral = (req, res) => {
  const referrerID = req.params.referrerID;
  //console.log('----->>>>',req.params)
  referralModel.getReferral(referrerID, (error, results) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error getting refferal' });
    }
    return res.status(201).json({ message: 'successfully fetched referral', results });
  });

  // const Result = {  message: 'successfully fetched specific refferal'};
  // return res.status(201).json(Result);
};


// to get refferals for me 

exports.getReferralForMe = (req, res) => {
  const referred_to = req.params.referrerID;
  console.log("required params---->", req.params)
  console.log('referred_to id--->', referred_to)
  referralModel.getReferralForMe(referred_to, (error, results) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error getting refferal' });
    }
    return res.status(201).json({ message: 'successfully fetched referral', results });
  });

};

// to get refferals By me

exports.getReferralByMe = (req, res) => {
  const referred_by = req.params.referrerID;
  console.log("req.params---->", req.params);
  referralModel.getReferralByMe(referred_by, (error, results) => {
    if (error) {
      console.log(error)
      return res.status(500).json({ message: 'Error getting refferal' });
    }
    return res.status(201).json({ message: 'successfully fetched referral', results });
  });

};