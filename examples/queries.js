//FUNCTION: Return query results with cursor methods Ex. toArra(), next()
//DOCUMENTATION: https://docs.mongodb.com/manual/reference/method/js-cursor/
//EXAMPLE: let user = await db().collection('users').find({ email: email }).next();

//FUNCTION: Query documents in db
//DOCUMENTATION: https://www.w3schools.com/nodejs/nodejs_mongodb_find.asp
//EXAMPLE: let user = await db().collection('users').find({ email: email }).next();

//FUNCTION: Update document in db
//DOCUMENTATION: https://www.w3schools.com/nodejs/nodejs_mongodb_update.asp
//EXAMPLE: let update = await db().collection('devices').updateOne({ user_id: user_id }, { $set: { token: token } }).toArray();

//FUNCTION: Insert document in db
//DOCUMENTATION: https://www.w3schools.com/nodejs/nodejs_mongodb_insert.asp
//EXAMPLE: db().collection('devices').insertOne({ user_id: user_id, token: token });
