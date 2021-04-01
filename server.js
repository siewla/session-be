// Dependencies
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const db = mongoose.connection;
const session = require('express-session');
const cors = require('cors');
require('dotenv').config();

// Environment Variables
const mongoURI = process.env.MONGODB_URI;
const PORT = process.env.PORT;

app.use(
  cors({
    origin: process.env.FRONT_END_URL,
    credentials: true,
  }),
);

app.use(
  session({
    secret: 'wow very secret',
    cookie: {
      maxAge: 8 * 60 * 60 * 1000,
      secure: false,
    },
    saveUninitialized: false,
    resave: false,
    unset: 'destroy',
  }),
);

// Connect to Mongo
mongoose.connect(
  mongoURI,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => console.log('MongoDB connection established'),
);

// Error / Disconnection
db.on('error', (err) => console.log(err.message + ' is Mongod not running?'));
db.on('disconnected', () => console.log('mongo disconnected'));

// Middleware
app.use(express.urlencoded({ extended: false })); // extended: false - does not allow nested objects in query strings
app.use(express.json()); // returns middleware that only parses JSON

app.get('/', (req, res) => {
  res.send('Hi, the route is working fine.');
});

// this will catch any route that doesn't exist

const sessionController = require('./controllers/session.js');
const dummyController = require('./controllers/dummy.js');
const userController = require('./controllers/user.js');
app.use('/session', sessionController);
app.use('/user', userController);
app.use('/dummy', dummyController);

app.get('*', (req, res) => {
  res.status(404).json('Sorry, page does not exist!');
});

app.listen(PORT, () => {
  console.log('App is listening on port', PORT);
});
