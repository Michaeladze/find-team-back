const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  firstName: String,
  lastName: String,
  position: String
});

const Users = mongoose.model('users', UserSchema);

module.exports = Users;
