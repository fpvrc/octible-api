const express = require('express');
const { connectDB } = require('./config/mongo');
const { connectSMTP } = require('./config/nodemailer');
const app = express();
var cors = require('cors');
const AWS = require('aws-sdk');

// Connect Mongo Database
connectDB();

// Connect SMTP
connectSMTP();

//Configure AWS params
AWS.config.update({
  accessKeyId: 'AKIARIRKFSJMZMPIFA7X',
  secretAccessKey: '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',
  region: 'us-east-2',
  signatureVersion: 'v4',
});

//Cores
app.use(cors());

// Init Middleware
app.use(express.json());

// API Routes densocial.io/...
//General
app.use('/auth', require('./api/Auth'));

//Menus
app.use('/menus', require('./api/Menus'));

//dba
app.use('/dba', require('./api/Dba'));

//maintenance
app.use('/maintenance', require('./api/Maintenance'));

//Analytics
app.use('/analytics', require('./api/Analytics'));

//Listen on port 5000 (local) or env.PORT for (production)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
