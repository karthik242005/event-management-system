import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const transporter = nodemailer.createTransport({
  service: 'gmail', // Use Gmail or any other provider
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendRegistrationEmail = async (to, eventTitle) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: `✅ Registered for ${eventTitle}`,
    html: `<p>Hello,</p><p>You have successfully registered for the event <strong>${eventTitle}</strong>.</p><p>Best wishes,<br/>Event Management Team</p>`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📩 Email sent to ${to}`);
  } catch (err) {
    console.error("❌ Email send error:", err.message);
  }
};
