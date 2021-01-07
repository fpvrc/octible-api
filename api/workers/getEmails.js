//Emails

const registerEmail = (email_address, hash) => {
  const html = `<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EMAIL_SUBJECT</title>
</head>
<body style="margin: 0">
<table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: #fff9ee;">
  <tbody>
  <tr>
      <td style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; background-color: #fff;">
              <tbody>
              <tr>
                  <td style="padding: 0 20px;">
                      <table style="border-collapse: collapse; margin: 0 auto; width: 100%; max-width: 400px;">
                          <tbody>
                          <tr>
                              <td style="width: 100%; overflow: hidden">
                                  <img src="https://den-media-staging.s3-us-west-1.amazonaws.com/emails-media/den-roommates.png" style="display: block; height: 48px; width: 128px; margin: 48px auto 40px auto;">
                              </td>
                          </tr>
                          <tr>
                              <td style="">
                              <table style="width: 100%; border-collapse: collapse;">
                              <tbody>
                              <tr>
                                  <td style="text-align: left; padding-bottom: 24px; font-family: Helvetica; font-size: 32px; line-height: 1.25; color: #020d17; font-weight: normal;">
                                      Verify your email to finish signing up with Den
                                  </td>
                              </tr>
                              <tr>
                                  <td style="text-align: left; padding-bottom: 16px; font-family: Helvetica; font-size: 18px; line-height: 1.33; font-weight: bold; color: #020d17;">
                                      You’re one step away!
                                  </td>
                              </tr>
                              <tr>
                                  <td style="text-align: left; padding-bottom: 40px; font-family: Helvetica; font-size: 18px; line-height: 1.33; font-weight: normal; color: #020d17;">
                                      Please confirm that ${email_address} is your email by clicking on the button below or using
                                      <a href="http://3.239.57.183/auth/verify_email_fw/${hash}" style="font-family: Helvetica; font-size: 18px; line-height: 1.33; font-weight: normal; color: #020d17; text-decoration: none;">this link</a>
                                  </td>
                              </tr>
                              <tr>
                                  <td style="padding-bottom: 48px; text-align: center">
                                      <a href="http://3.239.57.183/auth/verify_email_fw/${hash}" style="display: block; font-family: 'Helvetica'; margin: 0 auto; text-decoration: none; line-height: 56px; height: 56px; border-radius: 16px; background-color: #ffc800; width: 256px; text-align: center; font-size: 18px; font-weight: 500; letter-spacing: -0.26px; color: #020d17; cursor: pointer;">
                                          verify my email
                                      </a>
                                  </td>
                              </tr>
                              </tbody>
                              </table>
                              </td>
                          </tr>

                          <tr>
                              <td style="color: #081833; font-family: Helvetica; font-size: 12px; line-height: 1.17; text-align: center; padding-top: 40px; padding-bottom: 48px;">
                                  Copyright © 2020 Den, All rights reserved.
                                  <br>
                                  <br>
                                  Our mailing address is:
                                  <br>
                                  6353 El Cajon Blvd. Ste. 124 #231
                                  <br>
                                  San Diego, CA 92115
                              </td>
                          </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
              </tbody>
          </table>
      </td>
  </tr>
  </tbody>
</table>
</body>`;
  return html;
};

const forgotPswEmail = (hash) => {
  const html = `<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>EMAIL_SUBJECT</title>
</head>
<body style="margin: 0">
<table style="width: 100%; max-width: 600px; margin: 0 auto; border-collapse: collapse; background-color: #fff9ee;">
  <tbody>
  <tr>
      <td style="padding: 24px;">
          <table style="width: 100%; border-collapse: collapse; background-color: #fff;">
              <tbody>
              <tr>
                  <td style="padding: 0 20px;">
                      <table style="border-collapse: collapse; margin: 0 auto; width: 100%; max-width: 400px;">
                          <tbody>
                          <tr>
                              <td style="width: 100%; overflow: hidden">
                                  <img src="https://den-media-staging.s3-us-west-1.amazonaws.com/emails-media/den-roommates.png" style="display: block; height: 48px; width: 128px; margin: 48px auto 40px auto;">
                              </td>
                          </tr>
                          <tr>
                              <td style="">
                              <table style="width: 100%; border-collapse: collapse">
                              <tbody>
                                <tr>
                                  <td
                                    style="
                                      text-align: left;
                                      padding-bottom: 24px;
                                      font-family: Helvetica;
                                      font-size: 32px;
                                      line-height: 1.25;
                                      color: #020d17;
                                      font-weight: normal;
                                    "
                                  >
                                    Reset your password
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style="
                                      text-align: left;
                                      padding-bottom: 20px;
                                      font-family: Helvetica;
                                      font-size: 18px;
                                      line-height: 1.33;
                                      font-weight: normal;
                                      color: #020d17;
                                    "
                                  >
                                    You’re receiving this email because you requested a password reset for
                                    your Den account.
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style="
                                      text-align: left;
                                      padding-bottom: 16px;
                                      font-family: Helvetica;
                                      font-size: 18px;
                                      line-height: 1.33;
                                      font-weight: normal;
                                      color: #020d17;
                                    "
                                  >
                                    Please tap the button below to choose a new password.
                                  </td>
                                </tr>
                                <tr>
                                  <td style="padding-bottom: 40px; text-align: center">
                                    <a
                                      href="http://3.239.57.183/auth/forgot_password_fw/${hash}"
                                      style="
                                        display: block;
                                        font-family: 'Helvetica';
                                        margin: 0 auto;
                                        text-decoration: none;
                                        line-height: 56px;
                                        height: 56px;
                                        border-radius: 16px;
                                        background-color: #ffc800;
                                        width: 256px;
                                        text-align: center;
                                        font-size: 18px;
                                        font-weight: 500;
                                        letter-spacing: -0.26px;
                                        color: #020d17;
                                        cursor: pointer;
                                      "
                                    >
                                      reset my password
                                    </a>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style="
                                      text-align: left;
                                      padding-bottom: 48px;
                                      font-family: Helvetica;
                                      font-size: 16px;
                                      line-height: 1.25;
                                      font-weight: normal;
                                      color: #636c73;
                                    "
                                  >
                                    If you didn’t request to change your Den password, please ignore this
                                    email.
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                              </td>
                          </tr>
<!--                             <tr>
                              <td style="text-align: center; padding-bottom: 24px; border-top: 2px solid #edf0f5; padding-top: 40px;">
                                  <a href="https://www.instagram.com/dencollege/" style="display: inline-block; height: 28px; width: 28px; margin-right: 24px;">
                                      <img src="https://den-media-staging.s3-us-west-1.amazonaws.com/emails-media/instagram.png" style="display:block;" class="" width="28" height="28">
                                  </a>
                                  <a href="https://www.facebook.com/Den-103614824543017" style="display: inline-block; height: 28px; width: 28px; margin-right: 0px;">
                                      <img src="https://den-media-staging.s3-us-west-1.amazonaws.com/emails-media/facebook.png" style="display:block;" class="" width="28" height="28">
                                  </a>
                                  <a href="" style="display: inline-block; height: 28px; width: 28px;">
                                      <img src="https://den-media-staging.s3-us-west-1.amazonaws.com/emails-media/pinterest.png" style="display:block;" class="" width="28" height="28">
                                  </a>
                              </td>
                          </tr> -->
                          <tr>
                              <td style="color: #081833; font-family: Helvetica; font-size: 12px; line-height: 1.17; text-align: center; padding-top: 40px; padding-bottom: 48px;">
                                  Copyright © 2020 Den, All rights reserved.
                                  <br>
                                  <br>
                                  Our mailing address is:
                                  <br>
                                  6353 El Cajon Blvd. Ste. 124 #231
                                  <br>
                                  San Diego, CA 92115
                              </td>
                          </tr>
                          </tbody>
                      </table>
                  </td>
              </tr>
              </tbody>
          </table>
      </td>
  </tr>
  </tbody>
</table>
</body>`;
  return html;
};

module.exports = { registerEmail, forgotPswEmail };
