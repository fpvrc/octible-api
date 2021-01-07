const nodemailer = require('nodemailer');

let transporter = nodemailer.createTransport({
  host: 'smtp.sendgrid.net',
  port: 465,
  secure: true,
  auth: {
    user: 'apikey',
    pass:
      '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',
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
