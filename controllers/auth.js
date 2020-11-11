const db = require('../config/connection');
const Users = require('../models/users.schema');
const Credentials = require('../models/credentials.schema');
const messages = require('../config/messages');
const Response = require('../config/response');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const saltRounds = 10;

const login = (req, res) => {
  Users.findOne({ email: req.body.email })
    .then((user) => {

      Credentials.findOne({ userId: user._id })
        .then(credential => {

          bcrypt.compare(req.body.password, credential.userPassword).then((response) => {
            if (response && user.email === req.body.email) {

              const payload = {
                login: req.body.email,
                status: true
              };

              const token = jwt.sign(payload, 'superSecret', {
                expiresIn: 86400 // expires in 24 hours
              });

              res.json(new Response({ user, token }, messages.SUCCESS));
            } else {
              res.json(new Response({ user: {}, token: null }, messages.WRONG_CREDENTIALS));
            }
          });

        });
    })
    .catch(() => {
      res.json(new Response({ user: {}, token: null }, messages.WRONG_CREDENTIALS));
    });
};

const register = (req, res) => {
  Users.findOne({ email: req.body.email })
    .then((result) => {
      // If user already exists
      if (result) {
        res.json(new Response({ user: {}, token: null }, messages.EMAIL_EXISTS));
      } else {
        throw new Error();
      }

    })
    .catch(() => {
      const user = new Users({
        email: req.body.email
      });

      user.save()
        .then(result => {

          /** Create password in password table */
          bcrypt.hash(req.body.password, saltRounds).then((hash) => {
            const credentials = new Credentials({
              userId: result._id,
              userPassword: hash
            });

            credentials.save().then(() => {
              const payload = {
                login: req.body.email,
                status: true
              };

              const token = jwt.sign(payload, 'superSecret', {
                expiresIn: 86400 // expires in 24 hours
              });


              res.json(new Response({ user: result, token: token }, messages.SUCCESS));
            });
          });
        });
    });
};

const verifyToken = (req, res, next) => {

  const token = req.params.token;

  if (token) {
    // verifies secret and checks exp
    jwt.verify(token, 'superSecret', function (err, decoded) {
      if (err) {
        console.log(err);
        return res.json({
          user: {},
          status: false,
          message: messages.BAD_TOKEN
        });
      } else {
        // if everything is good, save to request for use in other routes
        req.decoded = decoded;
        next();
      }
    });

  } else {
    return res.json(new Response({ user: {}, token: null }, messages.NO_TOKEN));
  }
};

const checkToken = (req, res) => {
  return new Promise((resolve, reject) => {

      const login = req.decoded.login;

      db()
        .then(() => {
          Users.findOne({ email: login })
            .then((result) => {
              if (result) {

                res.json(new Response({ user: result, token: null }, messages.SUCCESS));
              } else {
                throw new Error();
              }
            })
            .catch(() => {
              res.json(new Response({ user: {}, token: null }, messages.NO_TOKEN));
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  );
};

module.exports = {
  register, login, verifyToken, checkToken
};
