const express = require('express');
const dummy = express.Router();

dummy.get('/', (req, res) => {
  if (req.session.currentUser) {
    res.json('Your session is active');
  } else {
    res.json('Your session is inactive');
  }
});

module.exports = dummy;
