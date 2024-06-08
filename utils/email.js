const { Resend } = require("resend");
const dotenv = require("dotenv");

dotenv.config();
const fromEmail = process.env.EMAIL_ID;
const resendApiKey = process.env.EMAIL_API_KEY;

const resend = new Resend(resendApiKey);

const sendEmail = async (to, subject, html) => {
  await resend.emails.send({
    from: `API Gateway <${fromEmail}>`,
    to: [to],
    subject: subject,
    html: html,
  });
};

module.exports = sendEmail;
