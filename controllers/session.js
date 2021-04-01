const express = require('express');
const session = express.Router();
const User = require('../models/users');
const bcrypt = require('bcrypt');

session.get('/', (req, res) => {
  if (req.session.currentUser) {
    res.json(req.session.currentUser);
  } else res.json('no active session');
});

session.post('/', (req, res) => {
  // console.log(req.body);
  User.findOne({ username: req.body.username }, (err, foundUser) => {
    if (!foundUser) {
      res.json('cannot find user', req.body.username);
    } else {
      if (bcrypt.compareSync(req.body.password, foundUser.password)) {
        req.session.currentUser = foundUser.username;
        res.json(foundUser);
      } else res.json('unsuccessful login');
    }
  });
});

session.delete('/', (req, res) => {
  req.session.destroy((err) => {
    if (err) res.json(err);
    res.json('Destroyed session');
  });
});

module.exports = session;
