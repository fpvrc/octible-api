const express = require('express');
const router = express.Router();
const { db } = require('../config/mongo');
const auth = require('../middleware/auth');
const { customAlphabet } = require('nanoid');
const nanoid = customAlphabet('1234567890abcdefghijklmnopqrstuvwxyz', 12);

// @route    POST densocial.io/dba/get_all_dba
// @desc        Get all dbas
// @access   private
router.post('/get_all_dba', auth, async (req, res) => {
  try {
    const { user_id } = req.body;

    let dba_list = await db().collection('dba').find({}).toArray();
    res.json(dba_list);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

// @route    POST densocial.io/dba/create_dba
// @desc     Create new DBA
// @access   private
router.post('/create_dba', auth, async (req, res) => {
  try {
    const { dba_name } = req.body;
    const dba_id = nanoid();

    let new_dba = {
      dba_name: dba_name,
      dba_id: dba_id,
      logo_photo: null,
      background_photo: null,
      primary_color: null,
      background_color: 'white',
      title_color: null,
      sub_title_color: null,
      section_button_color: null,
      section_button_text_color: null,
      section_title_color: '',
      item_button_color: null,
      item_button_text_color: null,
      item_button_text_color2: null,
      items_footer_color: null,
      home_icon_color: null,
      single_item_text_color: null,
      footer_color: null,
      footer_text_color: null,
      accelerate: false,
    };

    await db().collection('dba').insertOne(new_dba);
    res.json(new_dba);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

// @route    POST densocial.io/dba/save_color
// @desc     Save Color
// @access   private
router.post('/save_color', auth, async (req, res) => {
  try {
    const { dba_id, active_color, color } = req.body;

    let dba = await db().collection('dba').find({ dba_id: dba_id }).next();

    dba[active_color] = color;

    await db()
      .collection('dba')
      .updateOne(
        { dba_id: dba_id },
        {
          $set: { ...dba },
        }
      );

    res.json(dba);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

module.exports = router;
