const mongoose = require('mongoose');

function db() {
  return new Promise(function (resolve, reject) {

    mongoose.connect(process.env.ATLAS_URI, { useUnifiedTopology: true, useNewUrlParser: true, poolSize: 25 });

    mongoose.connection.once('open', function () {
      console.log('open');
      resolve("Connection has been made.");
    });

    mongoose.connection.on('error', function (error) {
      reject("Connection error: " + error.message);
    });
  });
}

module.exports = db;
