const config = require('config');
const { check, validationResult } = require('express-validator');

const registerEmail = (verify_hash) => {
  const url = config.get('apiURL');
  const html = `<!DOCTYPE html>
    <head>
      <style>
      body {
      background-color: #4C9AFF;
      }
        h1 {
        text-align: center;
        color: white;
        }
        p {
        text-align: center;
        }
        h3 {
        text-align: center;
        }
        button {
        background-color: #4C9AFF;
        width: 200px;
        height: 70px;
        color: white;
        font-size: 25px;
        border-radius:60px;
        }
        a {
        color: white;
        font-size: 25px;
        }
      </style>
    <body>
    <h1>Octible</h1>
    <table style="background-color: #ffffff; border-radius: 30px; border-collapse: separate;" width="100%" cellspacing="0" cellpadding="15px" bgcolor="#ffffff">
    <tbody>
    <tr>
    <td class="esd-block-text es-p40t es-p10b es-p40r es-p40l" align="left" bgcolor="transparent">
    <h3><strong>Thank you for signing up with Octible!</strong> </h3>
   
    <p>In order to use our services, we ensure our users have verified emails. Please click <a href="http://${url}/auth/verify_email_hash/${verify_hash}">
    here</a>, or the button below, to get started with us!</p>
      <p>
        <a href="http://${url}/auth/verify_email_hash/${verify_hash}">
      <button> Verify Email </button>
        </a>
          </p>
    <p>&nbsp;</p>
    <p>Sincerely,</p>
      <p> <i>The Octible Developement Team</i> </p>
    </td>
    </tr>
    <tr>
    
    </tr>
    </tbody>
    </table>
      </body>
      </head>
    </html>`;
  return html;
};
const feedbackEmail = (req) => {
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return { errors: errors.array() };
    }

    try {
      const text = req.body.text
        .replace('<', 'XSS ALERT')
        .replace('>', 'XSS ALERT');
      const email = req.body.email;
      const date = new Date();
      const time =
        date.getMonth() +
        '/' +
        date.getDay() +
        '/' +
        date.getFullYear() +
        ' at ' +
        date.getHours() +
        ':' +
        (date.getMinutes() <= 9 ? `0${date.getMinutes()}` : date.getMinutes()) +
        '.';
      if (!email) {
        console.log('No email provided!!!!!!!!!!!');
      } else {
        const output1 = `
        <p>Hi there! A user with the email of ${email} submitted the following feedback on ${time}</p>
        <p>${text}</p>
        <p> Use this feedback as you see fit! </p>
        `;
        let actualOutput = `<!DOCTYPE html>
        <head>
          <style>
          body {
          background-color: #4C9AFF;
          }
            h1 {
            text-align: center;
            color: white;
            }
            p {
            text-align: center;
            }
            h3 {
            text-align: center;
            }
            button {
            background-color: #4C9AFF;
            width: 200px;
            height: 70px;
            color: white;
            font-size: 25px;
            border-radius:60px;
            }
            a {
            color: white;
            font-size: 25px;
            }
          </style>
        <body>
        <h1>Octible</h1>
        <table style="background-color: #ffffff; border-radius: 30px; border-collapse: separate;" width="100%" cellspacing="0" cellpadding="15px" bgcolor="#ffffff">
        <tbody>
        <tr>
        <td class="esd-block-text es-p40t es-p10b es-p40r es-p40l" align="left" bgcolor="transparent">
        <h3><strong>Thank you for choosing Octible!</strong> </h3>
        ${output1}
        <p>&nbsp;</p>
        <p>Sincerely,</p>
          <p> <i>The Octible Developement Team</i> </p>
        </td>
        </tr>
        <tr>
        
        </tr>
        </tbody>
        </table>
          </body>
          </head>
        </html>                                                                           `;

        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
          host: 'smtp.gmail.com',
          port: 587,
          secure: false, // true for 465, false for other ports
          auth: {
            user: 'octible@gmail.com', // generated ethereal user
            pass: '123Octible123' // generated ethereal password
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        // setup email data with unicode symbols
        let mailOptions = {
          from: '"Octible" <octible@gmail.com>', // sender address
          to: ['nathanielshalev@gmail.com'], // list of receivers
          subject: 'New Feedback From User', // Subject line
          text: 'Hello world?', // plain text body
          html: actualOutput // html body
        };
        // setup email data with unicode symbols
        let mailOptions2 = {
          from: '"Octible" <octible@gmail.com>', // sender address
          to: email, // list of receivers,
          subject: 'Feedback Was Submitted!', // Subject line
          text: 'Hello world?', // plain text body
          html: actualOutput // html body
        };
        // send mail with defined transport object
        transporter.sendMail(mailOptions2, (error, info) => {
          if (error) {
            return; //console.log(error);
          }
          console.log('Message sent to user: %s', info.messageId);
          return;
        });
        // send mail with defined transport object
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            console.log(error);
            return;
          }
          console.log('Message sent to us: %s', info.messageId);
        });
      }
    } catch (err) {
      console.error(err.message);
    }
};

module.exports = { registerEmail, feedbackEmail };
