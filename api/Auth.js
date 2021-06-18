const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { db } = require('../config/mongo');
const { nanoid } = require('nanoid/async');
const { transporter } = require('../config/nodemailer');
const { registerEmail } = require('./workers/getEmails');
const url = config.get('apiURL');
const url2 = config.get('reactURL');
//const { registerEmail, forgotPswEmail } = require('./workers/getEmails');

// @route    POST densocial.io/auth/login
// @desc     Login user by email
// @access   Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await db().collection('users').find({ email: email }).next();
    if (!user) {
      return res.status(400).send(`Account not found`);
    }
    if (user.verify_hash) {
      return res.status(400).send('Please verify your email');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Username and / or password is invalid.');
    }
    jwt.sign(
      user,
      config.get('jwtSecret'),
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token: token,
          user: user,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

// @route    POST densocial.io/auth/new_password
// @desc     Set new password
// @access   Public
router.post('/new_password', async (req, res) => {
  console.log('Receiving');
  try {
    console.log('------REceived');
    const { verify_hash, password } = req.body;
    let user = await db()
      .collection('users')
      .find({ verify_hash: verify_hash })
      .next();
    if (!user) {
      return res.status(400).send(`Account not found`);
    }

    const salt = await bcrypt.genSalt(10);
    new_password = await bcrypt.hash(password, salt);

    await db()
      .collection('users')
      .updateOne(
        { verify_hash: verify_hash },
        { $set: { verify_hash: null, password: new_password } }
      );
    console.log('Made it here');

    jwt.sign(
      user,
      config.get('jwtSecret'),
      { expiresIn: '5 days' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token: token,
          user: user,
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

// @route    POST densocial.io/auth/register
// @desc     Register new user
// @access   Public
router.post('/register', async (req, res) => {
  try {
    const { email } = req.body;

    let user = await db().collection('users').find({ email: email }).next();
    if (user) {
      return res.status(400).send('User Already Exists');
    }

    const user_id = await nanoid(10);
    const dba_id = await nanoid(10);

    const verify_hash = await nanoid(10);

    await Promise.all([
      db()
        .collection('users')
        .insertOne({
          user_id: user_id,
          dba_id: dba_id,
          email: email,
          created_at: new Date().toISOString(),
          verify_hash: verify_hash,
        })
        .next(),
      db().collection('dba').insertOne({ dba_id: dba_id }).next(),
    ]);

    const html = registerEmail(verify_hash);

    await transporter.sendMail({
      from: '"Octible" <octible@gmail.com>',
      to: email,
      subject: 'Please Verify Your Email',
      text: 'Please click the link to verify your email',
      html: html,
    });
    res.json('Success');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Something went wrong.');
  }
  return;
});

// @route    GET densocial.io/auth/verify_email/:hash
// @desc     Verify new user email
// @access   Public
router.post('/verify_email', async (req, res) => {
  try {
    const { verify_hash } = req.body;
    const date = new Date().toISOString();
    await db()
      .collection('users')
      .updateOne(
        { verify_hash: verify_hash },
        { $set: { verify_hash: null, verified_at: date } }
      );
    res.json('Success');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

// @route    GET densocial.io/auth/verify_email/:hash
// @desc     Verify new user email
// @access   Public
router.post('/fire', async (req, res) => {
  try {
    console.log(req.body.num);
    res.json(req.body);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

// @route    POST densocial.io/auth/forgot_password
// @desc     Forgot password
// @access   Public
router.post('/forgot_password', async (req, res) => {
  try {
    const { email } = req.body;
    const new_code = nanoid(12);
    await db()
      .collection('users')
      .updateOne({ email: email }, { $set: { reset_password: new_code } });

    const html = forgotPswEmail(new_code);
    await transporter.sendMail({
      from: 'no-reply@densocial.io',
      to: email,
      subject: 'Password Reset Request',
      text: 'Please click here to reset your password',
      html: html,
    });
    res.json('Success');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

// @route    POST densocial.io/auth/forgot_password_fw
// @desc     Redirect to login screen
// @access   Public
router.get('/forgot_password_fw/:hash', async (req, res) => {
  try {
    const hash = req.params.hash;
    res.redirect(`den://resetPassword/${hash}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

// @route    POST densocial.io/auth/reset_password
// @desc     Reset password
// @access   Public
router.post('/reset_password', async (req, res) => {
  try {
    const { password, reset_password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const new_password = await bcrypt.hash(password, salt);
    await db()
      .collection('users')
      .updateOne(
        { reset_password: reset_password },
        { $set: { reset_password: null, password: new_password } }
      );
    res.json('Success');
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

router.get('/verify_email_hash/:verify_hash', async (req, res) => {
  try {
    const verify_hash = req.params.verify_hash;
    const date = new Date().toISOString();
    await db()
      .collection('users')
      .updateOne({ verify_hash: verify_hash }, { $set: { verified_at: date } });
    console.log('Verified');
    res.redirect(`http://${url2}/resetpsw/${verify_hash}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

router.post('/delete', async (req, res) => {
  try {
    const { user_id } = req.body;
    await db().collection('Notifications').deleteOne({ id: user_id });
    await db().collection('users').deleteOne({ id: user_id });
    res.status(500).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

module.exports = router;
