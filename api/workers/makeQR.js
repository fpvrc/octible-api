let QRCode = require('qrcode');
const config = require('config');

const makeQR = async (url_id) => {
  try {
    //QR stuff
    const cache_path = `./qrCodes/${url_id}.png`;
    const qr_url = `${config.get('apiURL')}/menus/${url_id}`;
    //const path = `https://www.public.octibleapi.com/menus/${qrId}`
    await QRCode.toFile(cache_path, qr_url);
    //const qrBase64 = await QRCode.toDataURL(qr_url); //FIXME?
    return url_id;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

const uploadQr = async (url_id) => {
  try {
    //QR stuff
    const cache_path = `./qrCodes/${url_id}.png`;
    const qr_url = `${config.get('apiURL')}/menus/${url_id}`;
    //const path = `https://www.public.octibleapi.com/menus/${qrId}`
    await QRCode.toFile(cache_path, qr_url);
    //const qrBase64 = await QRCode.toDataURL(qr_url); //FIXME?
    return url_id;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

module.exports = { makeQR, uploadQr };
