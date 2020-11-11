const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CredentialsSchema = new Schema({
  userId: String,
  userPassword: String
});

const Credentials = mongoose.model('credentials', CredentialsSchema);

module.exports = Credentials;
