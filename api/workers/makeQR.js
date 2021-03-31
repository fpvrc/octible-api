let QRCode = require('qrcode');
const makeQR = async (qrId) => {
  try {
    //QR stuff
    const path = `./qrCodes/${qrId}.png`;
    //const path = `https://www.public.octibleapi.com/menus/${qrId}`
    QRCode.toFile(path, qrId + '.png');
    const qrBase64 = await QRCode.toDataURL(qrId + '.png'); //FIXME?
    return qrBase64;
  } catch (error) {
    console.log(error);
    throw new Error();
  }
};

module.exports = { makeQR };
