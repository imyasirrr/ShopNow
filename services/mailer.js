const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendMail = async ({ name, email, message }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    secure: false,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"${name}" <${process.env.MAIL_USER}>`,
    to: process.env.RECEIVER_EMAIL,
    subject: "Shop Now Contact Form",
    replyTo: email,
    html: `
      <h2>Contact Form Submission</h2>
      <p><strong>Name:</strong> ${name}</p>
      <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
      <p><strong>Message:</strong><br>${message}</p>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendMail };
