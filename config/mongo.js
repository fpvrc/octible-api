const { MongoClient } = require('mongodb');
const config = require('config');
const uri = config.get('mongoURI');
let _db;

const connectDB = async () => {
  let mongodb = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  _db = mongodb.db('production');
  console.log('Mongo DB Connected...');
  return;
};

const db = () => {
  return _db;
};

const close = () => {
  _db.close();
  return;
};

module.exports = {
  connectDB,
  db,
  close,
};
