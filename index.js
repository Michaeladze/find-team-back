const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./config/connection');
const { register, login, verifyToken, checkToken } = require('./controllers/auth');

const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 8080;

/************************** Authentication **************************/
app.get('/check/:token', verifyToken, (req, res) => {
  checkToken(req, res);
});

app.post('/login', (req, res) => {
  login(req, res);
});

app.post('/register', (req, res) => {
  register(req, res);
});


const disconnect = () => {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected on app termination');
    process.exit(0);
  });
};

process.on('SIGINT', function () {
  disconnect();
});

db()
  .then(() => {
    console.log('Connected to the database');
    app.listen(PORT, () => {
      console.log('Connected to the server');
    });
  })
  .catch((err) => {
    console.log(err);
    disconnect();
  });
