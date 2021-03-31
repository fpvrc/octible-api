const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: 'octible@gmail.com',
    pass: '123Octible123',
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const connectSMTP = async () => {
  try {
    await transporter.verify();
    console.log('SMTP Connected...');
  } catch (e) {
    console.log(e);
  }
};

module.exports = { connectSMTP, transporter };
