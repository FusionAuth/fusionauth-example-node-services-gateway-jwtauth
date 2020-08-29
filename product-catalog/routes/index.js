const express = require('express');
const router = express.Router();

router.get('/products', function(req, res, next) {
  res.json('products: []')
});

router.get('/products/:id', function(req, res, next) {
  res.json(`product: ${req.params.id}`)
});

module.exports = router;
