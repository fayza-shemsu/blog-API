// config/mailConfig.js
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    await sgMail.send({
      to,
      from: process.env.EMAIL_FROM, 
      subject,
      html,
    });
  } catch (error) {
    console.error(
      "SendGrid Error:",
      error.response ? error.response.body : error
    );
    throw error;
  }
};

module.exports = sendEmail;
