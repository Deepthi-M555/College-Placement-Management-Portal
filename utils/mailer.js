// utils/mailer.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT || 587),
  secure: process.env.EMAIL_SECURE === 'true' || false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// verify connection (optional)
transporter.verify().then(() => {
  console.log('Mailer connected');
}).catch(err => {
  console.warn('Mailer not connected:', err.message);
});

async function sendEmail({ to, subject, html, text }) {
  const info = await transporter.sendMail({
    from: process.env.FROM_EMAIL,
    to,
    subject,
    text,
    html
  });
  return info;
}

module.exports = { sendEmail };
