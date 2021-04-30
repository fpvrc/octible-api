const express = require('express');
const router = express.Router();

// @route    POST densocial.io/maintenance/ping
// @desc     Ping server
// @access   Public
router.post('/ping', async (req, res) => {
  try {
    res.json('Pong');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

module.exports = router;
