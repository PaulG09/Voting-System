const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendPasswordEmail = async (to, password) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject: 'Your Voting System Password',
    text: `Your voting password is: ${password}. It is valid until the end of the election period.`,
  };
  await transporter.sendMail(mailOptions);
};
