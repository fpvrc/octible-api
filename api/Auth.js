const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');
const { db } = require('../config/mongo');
const uniqid = require('uniqid');
const { transporter } = require('../config/nodemailer');
const { registerEmail, forgotPswEmail } = require('./workers/getEmails');

// @route    POST densocial.io/auth/login
// @desc     Login user by email
// @access   Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await db().collection('users').find({ email: email }).next();
    if (!user) {
      return res.status(400).send(`We couldn't find your Den account`);
    }
    if (user.verify_hash) {
      return res.status(400).send('Email not verified');
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
          access_token: token,
          user_id: user.id,
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
    const { email, password, school_email } = req.body;
    let user = await db().collection('users').find({ email: email }).next();
    if (user) {
      console.log('User already exists');
      return res.status(400).send('User Already Exists');
    }
    const salt = await bcrypt.genSalt(10);
    const hashed_password = await bcrypt.hash(password, salt);
    //const user_id = uniqid();
    const user_id = Math.round(Math.random() * 1000000000000000 + 100000000);
    const new_hash = uniqid();
    const date = new Date().toISOString();
    const email2 = school_email ? school_email : null;
    await db().collection('users').insertOne({
      id: user_id,
      email: email,
      school_email: email2,
      school_id: null,
      password: hashed_password,
      verify_hash: new_hash,
      last_activity: date,
      created_at: date,
      updated_at: date,
      emoji: '',
      comet_token: null,
      main_photo: '',
      activity: [],
      completed_r: false,
      completed_c: false,
    });

    const html = registerEmail(email, new_hash);

    await transporter.sendMail({
      from: 'no-reply@densocial.io',
      to: email,
      subject: 'Verify Your Email Address',
      text:
        'Please verify your email address with DEN by clicking here:  ' +
        new_hash,
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

// @route    POST densocial.io/auth/forgot_password
// @desc     Forgot password
// @access   Public
router.post('/forgot_password', async (req, res) => {
  try {
    const { email } = req.body;
    const new_code = uniqid();
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

router.get('/verify_email_fw/:hash', async (req, res) => {
  try {
    const hash = req.params.hash;
    res.redirect(`den://verifyEmail/${hash}`);
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
    await db().collection('blocked').deleteOne({ user_id: user_id });
    await db().collection('devices').deleteOne({ user_id: user_id });
    await db().collection('matches_r').deleteOne({ user_id: user_id });
    await db().collection('matches_c').deleteOne({ user_id: user_id });
    await db().collection('profiles_r').deleteOne({ user_id: user_id });
    await db().collection('profiles_c').deleteOne({ user_id: user_id });
    await db().collection('users').deleteOne({ id: user_id });
    res.status(500).send();
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
  return;
});

module.exports = router;
