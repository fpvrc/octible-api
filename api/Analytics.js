const express = require('express');
const router = express.Router();
const { db } = require('../config/mongo');
const auth = require('../middleware/auth');

// @route    POST densocial.io/analytics/capture_data
// @desc     Caputre data
// @access   private
router.post('/capture_data', auth, async (req, res) => {
  try {
    const { data } = req.body;
    await db().collection('analytics').insertOne(data);
    res.status(200).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

module.exports = router;
