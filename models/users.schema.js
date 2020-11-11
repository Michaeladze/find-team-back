const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  photo: String,
  firstName: String,
  lastName: String,
  position: String,
  bio: String
});

const Users = mongoose.model('users', UserSchema);

module.exports = Users;
