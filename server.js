const express = require('express');
const { connectDB } = require('./config/mongo');
const { connectSMTP } = require('./config/nodemailer');
const app = express();

// Connect Mongo Database
connectDB();

// Connect SMTP
connectSMTP();

// Init Middleware
app.use(express.json());

// API Routes densocial.io/...
//General
app.use('/auth', require('./api/Auth'));

//Listen on port 5000 (local) or env.PORT for (production)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
