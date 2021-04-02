let QRCode = require('qrcode');
const AWS = require('aws-sdk');
const config = require('config');
const fs = require('fs');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const s3 = new AWS.S3({
  accessKeyId: 'AKIARIRKFSJMZMPIFA7X',
  secretAccessKey: '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',
});

const makeQR = async (url_id) => {
  try {
    const cache_path = `./qrCodes/${url_id}.png`;
    const qr_url = `${config.get('apiURL')}/menus/${url_id}`;
    await QRCode.toFile(cache_path, qr_url);
    return url_id;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

const uploadQr = async (user_id, url_id) => {
  try {
    const data = await readFileAsync(`./qrCodes/${url_id}.png`);
    const params = {
      Bucket: 'octible',
      Key: `${user_id}/${url_id}.png`,
      Body: data,
    };
    await s3.upload(params).promise();
    (async () => {
      fs.unlink(`./qrCodes/${url_id}.png`, (err) => {
        if (err) {
          throw new Error();
        }
      });
    })();

    return;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

module.exports = { makeQR, uploadQr };
