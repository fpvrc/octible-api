const express = require('express');
const router = express.Router();
const config = require('config');
const { db } = require('../config/mongo');
const auth = require('../middleware/auth');
const AWS = require('aws-sdk');
const PDFDocument = require('pdfkit');
var blobStream = require('blob-stream');
const fs = require('fs');
const { makeQR, uploadQr } = require('./workers/makeQR');
const { nanoid } = require('nanoid');

// @route    POST octible.io/menus/:menu_id
// @desc     User scans QR and this entpoint is hit
// @access   Public
//https://public.octibleapi.com/menus/:menu_id

router.get('/:menu_id', async (req, res) => {
  try {
    const menu_id_long = req.params.menu_id;
    //const menu_id = menu_id_long.substring(1);
    let menu = await db()
      .collection('menus')
      .findOne({ menu_id: menu_id })
      .next();
    res.json(menu);
  } catch (error) {
    throw new Error();
  }
});

//ping
router.post('/ping', async (req, res) => {
  const menu_id = 'testing';
  //Const url = https://www.public.octibleapi.com/menus/`${menu_id}
  //Generate QR code with this url
  //Save qrCode to local file
  //Upload qrCode local file to s3 bucket => returns url location of qr file in the s3 bucket,
  //delete qr code in local directory
  //save qrCode file URL to menu object

  const qrRes = await makeQR('test');
  const user_id = '1234';
  await uploadQr(user_id, qrRes);
  console.log('done');

  //read file filename.png const filePath = './qrCodes/<qrName>';

  /*
        const data = await readFileAsync(`./qrCodes/${menu_id}`);
        const params = {
          Bucket: 'octible',
          Key: `${s3Folder}/${file.fileInfo.FileName}`,
          Body: data
        };
        await s3.upload(params).promise();
        (async () => {
          fs.unlink(`./staging/${file.fileInfo.FileName}`, (err) => {
            if (err) return console.log(err);
          });
        })();
      */
  //callQR worker function
  res.json('pong');
});

// @route    POST octible.io/menus/s3
// @desc     Get S3 upload params
// @access   Private
router.post('/s3', auth, async (req, res) => {
  try {
    const s3Folder = req.body.user_id;
    const uploadType = req.body.uploadType;
    const name = `${nanoid(6)}${uploadType}`;
    const params = {
      Bucket: 'octible',
      Fields: {
        Key: `${s3Folder}/${name}`,
      },
    };
    const options = {
      signatureVersion: 'v4',
      region: 'us-east-2',
      endpoint: new AWS.Endpoint('https://octible.s3.amazonaws.com/'),
      useAccelerateEndpoint: false,
      s3ForcePathStyle: true,
    };
    const client = new AWS.S3(options);
    const form = await new Promise((resolve, reject) => {
      client.createPresignedPost(params, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
    form.url = 'https://octible.s3.amazonaws.com/';
    return res.json(form);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
  return;
});

// @route    POST octible.io/menus/step_one
// @desc     Save step one
// @access   Private
router.post('/step_one', auth, async (req, res) => {
  try {
    const {
      menu_id,
      user_id,
      name,
      website,
      logo_photo,
      background_photo,
      pdf,
      sections,
      items,
      new_menu,
    } = req.body;

    if (new_menu) {
      //Const url = https://www.public.octibleapi.com/menus/`${menu_id}
      //Generate QR code with this url
      //Save qrCode to local file
      //Upload qrCode local file to s3 bucket => returns url location of qr file in the s3 bucket,
      //delete qr code in local directory
      //save qrCode file URL to menu object

      //makeQrCode() => returns filename.png

      //read file filename.png const filePath = './qrCodes/<qrName>';

      /*
        const data = await readFileAsync(`./qrCodes/${menu_id}`);
        const params = {
          Bucket: 'octible',
          Key: `${s3Folder}/${file.fileInfo.FileName}`,
          Body: data
        };
        await s3.upload(params).promise();
        (async () => {
          fs.unlink(`./staging/${file.fileInfo.FileName}`, (err) => {
            if (err) return console.log(err);
          });
        })();
      */
      const new_menu_id = nanoid(12);
      const url_id = nanoid(12);

      await db().collection('menus').insertOne({
        menu_id: new_menu_id,
        user_id: user_id,
        url_id: url_id,
        name: name,
        website: website,
        logo_photo: logo_photo,
        background_photo: background_photo,
        pdf: pdf,
        sections: sections,
        items: items,
        active: false,
        qr_url: null,
        redeem_code: null,
        new: false,
      });
    } else {
      await db()
        .collection('menus')
        .updateOne(
          { menu_id: menu_id, user_id: user_id },
          {
            $set: {
              name: name,
              website: website,
              logo_photo: logo_photo,
              background_photo: background_photo,
              pdf: pdf,
              sections: sections,
              items: items,
            },
          }
        );
    }
    let menu = await db()
      .collection('menus')
      .find({
        menu_id: menu_id,
      })
      .next();
    res.json(menu);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Errror');
  }
  return;
});

// @route    POST octible.io/menus/step_one_cms
// @desc     Save step one CMS
// @access   Private
router.post('/step_one_cms', auth, async (req, res) => {
  try {
    const {
      menu_id,
      user_id,
      name,
      website,
      logo_photo,
      background_photo,
      pdf,
      sections,
      items,
      new_menu,
    } = req.body;

    if (new_menu) {
      const redeem_code = nanoid(4); //=> "V1StGXR8_Z5jdHi6B-myT"
      //Const url = https://www.public.octibleapi.com/menus/`${menu_id}
      //Generate QR code with this url
      //Save qrCode to local file
      //Upload qrCode local file to s3 bucket => returns url location of qr file in the s3 bucket,
      //delete qr code in local directory
      //save qrCode file URL to menu object

      //makeQrCode() => returns filename.png

      //read file filename.png const filePath = './qrCodes/<qrName>';

      /*
          const data = await readFileAsync(`./qrCodes/${menu_id}`);
          const params = {
            Bucket: 'octible',
            Key: `${s3Folder}/${file.fileInfo.FileName}`,
            Body: data
          };
          await s3.upload(params).promise();
          (async () => {
            fs.unlink(`./staging/${file.fileInfo.FileName}`, (err) => {
              if (err) return console.log(err);
            });
          })();
        */

      await db().collection('menus').insertOne({
        menu_id: menu_id,
        user_id: 'octible',
        name: name,
        website: website,
        logo_photo: logo_photo,
        background_photo: background_photo,
        pdf: pdf,
        sections: sections,
        items: items,
        active: false,
        qr_url: null,
        redeem_code: redeem_code,
        new: false,
      });
    } else {
      await db()
        .collection('menus')
        .updateOne(
          { menu_id: menu_id, user_id: user_id },
          {
            $set: {
              name: name,
              website: website,
              logo_photo: logo_photo,
              background_photo: background_photo,
              pdf: pdf,
              sections: sections,
              items: items,
            },
          }
        );
    }
    let menu = await db()
      .collection('menus')
      .find({
        menu_id: menu_id,
      })
      .next();
    res.json(menu);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Errror');
  }
  return;
});

// @route    POST octible.io/menus/get_menus
// @desc     Get all menus for specific user
// @access   Private
router.post('/get_menus', auth, async (req, res) => {
  try {
    const { user_id } = req.body;
    let menus = await db()
      .collection('menus')
      .find({ user_id: user_id })
      .toArray();
    res.json(menus);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
  return;
});

// @route    GET octible.io/menus/activate
// @desc     Activate or deactivate menu
// @access   Private
router.post('/activate', auth, async (req, res) => {
  try {
    const { menu_id } = req.body;
    const menu = await db()
      .collection('menus')
      .find({ menu_id: menu_id })
      .next();
    await db()
      .collection('menus')
      .updateOne(
        { menu_id: menu_id },
        {
          $set: {
            active: !menu.active,
          },
        }
      );
    res.json(menu);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    POST octible.io/menus/save_step_two
// @desc     Save step two
// @access   Private
router.post('/save_step_two', auth, async (req, res) => {
  try {
    const { menu_id, item } = req.body;
    console.log(item);
    await db()
      .collection('menus')
      .updateOne(
        { menu_id: menu_id },
        {
          $push: {
            items: item,
          },
        }
      );
    let menu = await db().collection('menus').find({ menu_id: menu_id }).next();
    res.json(menu);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
  return;
});

// @route    DELETE octible.io/menus/delete/:id
// @desc     Delete a menu
// @access   Private
router.post('/delete', auth, async (req, res) => {
  try {
    const { id } = req.body;
    await db().collection('menus').deleteOne({ menu_id: id });
    res.json(id);
    console.log(id);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route    DELETE octible.io/menus/delete/:id
// @desc     Delete a menu
// @access   Private
router.post('/add_item_photo', auth, async (req, res) => {
  try {
    const { menu_id, item_id, photo_url } = req.body;

    let menu = await db().collection('menus').find({ menu_id: menu_id }).next();
    let new_items = menu.items.map((item) => {
      if (item.item_id === item_id) {
        let added_item = item;
        added_item.item_photos.push({
          url: `https://octible.s3.us-east-2.amazonaws.com/${photo_url}`,
          featured: null,
          order: null,
        });
        return added_item;
      } else {
        return item;
      }
    });
    menu.items = new_items;
    console.log(menu);
    await db().collection('menus').updateOne(
      { menu_id: menu_id },
      {
        $set: menu,
      }
    );
    res.json(menu);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    DELETE octible.io/menus/delete_section_item
// @desc     Delete section item
// @access   Private
router.post('/delete_section_item', auth, async (req, res) => {
  try {
    const { menu_id, section_item } = req.body;

    let menu = await db().collection('menus').find({ menu_id: menu_id }).next();
    let items = menu.items.filter(
      (item) => item.item_id !== section_item.item_id
    );
    menu.items = items;

    await db().collection('menus').updateOne(
      { menu_id: menu_id },
      {
        $set: menu,
      }
    );
    res.json(menu);
  } catch (err) {
    console.error(err.message);

    res.status(500).send('Server Error');
  }
});

// @route    POST octible.io/menus/qr
// @desc     Generate QR code and download PDF
// @access   Private

router.post('/qr', auth, async (req, res) => {
  console.log('QR Action Fired...');
  try {
    //This below action fires every time you press the button
    const qrId = nanoid(10);
    const qrBase64 = await makeQR(qrId);
    //PDF Stuff
    console.log('Creating PDF');
    try {
      const doc = new PDFDocument();
      const stream = doc.pipe(blobStream());
      // Fit the image within the dimensions
      const NUM_QR = 9;
      for (let k = 0; k < NUM_QR / 3; k++) {
        for (let i = 0; i < NUM_QR / 3; i++) {
          doc
            .image(qrBase64, 20 + 190 * i, 50 + 220 * k, { fit: [180, 180] })
            .stroke();
        }
      }
      // Stream contents to a file
      doc
        .pipe(fs.createWriteStream(`./pdfs/${qrId}.pdf`))
        .on('finish', function () {
          console.log('On Finish');
        });
      // Close PDF and write file.
      doc.end();
      console.log('Downloaded on Server');
      res.json('Success!');
    } catch (err) {
      console.log('PDF ERROR!!!!');
      console.log(err);
    }
  } catch (err) {
    console.error(err.message);
    return res.status(500).send('Server Error');
  }
});

// @route    POST octible.io/menus/get_all_menus
// @desc     Get all menus for Octible CMS
// @access   Private
router.post('/get_all_menus', auth, async (req, res) => {
  try {
    const { user_id } = req.body;
    let menus = await db().collection('menus').find({}).toArray();
    res.json(menus);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
  return;
});

// @route    POST octible.io/menus/redeem
// @desc     Redeem, change menu ownership
// @access   Private
router.post('/redeem', auth, async (req, res) => {
  try {
    const { user_id, redeem_code } = req.body;

    await db()
      .collection('menus')
      .updateOne(
        { redeem_code: redeem_code, user_id: 'octible' },
        { $set: { user_id: user_id, redeem_code: null } }
      );
    let menus = await db()
      .collection('menus')
      .find({ user_id: user_id })
      .toArray();
    res.json(menus);
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error');
  }
  return;
});

module.exports = router;
