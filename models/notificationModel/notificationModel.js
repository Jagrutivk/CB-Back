const AWS = require("aws-sdk");

const SES = new AWS.SES({ apiVersion: "2010-12-01" });

const sendEmailNotification = async (
  shouldSendEmail,
  recipient,
  ccRecipient,
  subject,
  emailTemplate
) => {
  if (shouldSendEmail === true) {
    if (recipient !== undefined && recipient !== null) {
      try {
        const params = {
          Source: "care@myhealthsaver.in",
          Destination: {
            ToAddresses: [recipient.toString()],
            CcAddresses: ccRecipient
          },
          Message: {
            Subject: {
              Data: subject.toString(),
            },
            Body: {
              Text: {
                Data: emailTemplate,
              },
            },
          },
        };

        SES.sendEmail(params, (error, data) => {
          if (error) {
            console.error("Error sending email:", error);
          } else {
            console.log("Email sent successfully:", data);
          }
        });
      } catch (error) {
        console.log("Reason for failure of email sending to the user:", error);
      }
    }
  }
};

module.exports = sendEmailNotification;
