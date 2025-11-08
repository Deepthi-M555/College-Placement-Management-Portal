// utils/mailer.js
const nodemailer = require("nodemailer");
// configure with your credentials or env vars
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: process.env.MAIL_USER, pass: process.env.MAIL_PASS }
});
async function sendMail({ to, subject, html }) {
  if (!to || to.length === 0) return;
  await transporter.sendMail({ from: process.env.MAIL_USER, to, subject, html });
}
module.exports = { sendMail };
