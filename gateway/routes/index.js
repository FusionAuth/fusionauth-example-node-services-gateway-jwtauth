const request = require('request');
const express = require('express');
const router = express.Router();
const {FusionAuthClient} = require('@fusionauth/typescript-client');
const clientId = 'b2b82e4f-6b5a-47c6-af3d-c904ef59d7db';
const clientSecret = 'k4Ldb41rzOy9NmN6wp-Dj5kqcgza_5llmK1CzpGb3xk';
const client = new FusionAuthClient('noapikeyneeded', 'http://localhost:9011');

/* GET home page. */
router.get('/', function (req, res, next) {
  const stateValue = Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15) + Math.random().toString(36).substring(2,15);
  req.session.stateValue = stateValue
  res.render('index', {user: req.session.user, stateValue: stateValue, title: 'FusionAuth Example'});
});

/* OAuth return from FusionAuth */
router.get('/oauth-redirect', function (req, res, next) {
  // This code stores the user in a server-side session
  const stateFromServer = req.query.state;
  if (stateFromServer !== req.session.stateValue) {
    console.log("State doesn't match. uh-oh.");
    console.log("Saw: "+stateFromServer+ ", but expected: "+req.session.stateValue);
    res.redirect(302, '/');
    return;
  }
  client.exchangeOAuthCodeForAccessToken(req.query.code,
                                         clientId,
                                         clientSecret,
                                         'http://localhost:3000/oauth-redirect')
      .then((response) => {
        console.log(response.response.access_token);
        return client.retrieveUserUsingJWT(response.response.access_token);
      })
      .then((response) => {
        req.session.user = response.response.user;
      })
      .then((response) => {
        res.redirect(302, '/');
      }).catch((err) => {console.log("in error"); console.error(JSON.stringify(err));});
});

/* AUTHENTICATION MIDDLEWARE
 * This can be added to any route to check for an authenticated user
 */
const checkAuthentication = function(req, res, next) {
  const user = req.session.user;
  if (!user) {
    res.redirect(302, '/');
    return;
  }
  next();
}

/* PRODUCT CATALOG ROUTES */
const productUrl = 'http://localhost:3001';
const PRODUCT_CATALOG_API_KEY = 'eivs8sslds39ekdhsf029eh23752o';

router.get('/products', function(req, res, next) {
  const options = {
    url: `${productUrl}/products`,
    headers: { api_key: PRODUCT_CATALOG_API_KEY }
  }
  request(options).pipe(res);
});

router.get('/products/:id', function(req, res, next) {
  const options = {
    url: `${productUrl}/products/${req.params.id}`,
    headers: { api_key: PRODUCT_CATALOG_API_KEY }
  }
  request(options).pipe(res);
});

/* PRODUCT INVENTORY ROUTES */
const PRODUCT_INVENTORY_API_KEY = '48sldkkj37lsl300dllkj9s003l';

router.get('/branches/:id/products', checkAuthentication, function(req, res, next) {
  const user = req.session.user;
  const options = {
    url: `http://localhost:3002/branches/${req.params.id}/products`,
    headers: {
      roles: user.registrations[0].roles,
      api_key: PRODUCT_INVENTORY_API_KEY
    }
  };
  request(options).pipe(res);
});

module.exports = router;
