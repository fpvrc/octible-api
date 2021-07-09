const express = require('express');
const router = express.Router();
const { feedbackEmail } = require('./workers/getEmails');
const auth = require('../middleware/auth');
// @route    POST octible.io/feedback
// @desc     Ping server
// @access   Public
router.post('/feedback', auth, async (req, res) => {
  try {
    console.log("Sup");
    feedbackEmail(req);
    res.json('Pong');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

module.exports = router;
