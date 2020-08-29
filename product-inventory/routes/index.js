const express = require('express');
const router = express.Router();

router.get('/branches/:id/products', function(req, res, next) {
  const roles = req.headers.roles;
  if (roles.includes('admin')) {
    res.json(`Products for branch #${req.params.id}`);
  } else {
    res.json('Unauthorized')
  }
});

module.exports = router;
