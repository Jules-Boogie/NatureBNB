const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) create a trasnporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  // 2) define email options
  const mailOptions = {
    from: 'Juliet George <jules@test.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };
  // 3) send email with node mailer
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
