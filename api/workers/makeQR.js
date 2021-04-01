let QRCode = require('qrcode');
const AWS = require('aws-sdk');
const config = require('config');
const fs = require('fs');
const readFileAsync = promisify(fs.readFile);

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

const uploadQr = async (url_id) => {
  try {
    const s3 = new AWS.S3({
      accessKeyId: 'AKIARIRKFSJMZMPIFA7X',
      secretAccessKey: '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',
    });

    const data = await readFileAsync(`./qrCodes/${url_id}.png`);
    const params = {
      Bucket: 'octible',
      Key: `${s3Folder}/${file.fileInfo.FileName}`,
      Body: data,
    };
    await s3.upload(params).promise();
    (async () => {
      fs.unlink(`./staging/${file.fileInfo.FileName}`, (err) => {
        if (err) return console.log(err);
      });
    })();

    return;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

module.exports = { makeQR, uploadQr };
