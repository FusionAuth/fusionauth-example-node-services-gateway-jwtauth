const express = require('express');
const router = express.Router();

// TODO: make an environment variable
API_KEY = 'eivs8sslds39ekdhsf029eh23752o';

const checkAPIKey = function(req, res, next) {
  const key = req.headers.api_key;
  if (key !== API_KEY) {
    res.redirect(401, 'http://localhost:3000');
    return;
  }
  next();
};

router.get('/products', checkAPIKey, function(req, res, next) {
  res.json('products: []')
});

router.get('/products/:id', checkAPIKey, function(req, res, next) {
  res.json(`product: ${req.params.id}`)
});

module.exports = router;
