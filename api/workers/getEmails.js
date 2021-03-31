const config = require('config');

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

module.exports = { registerEmail };
