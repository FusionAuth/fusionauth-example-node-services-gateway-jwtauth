# API Gateway Application

This project is a simple example Node/Express application that functions as an API Gateway for microservices. It is based on a simple eCommerce domain that with a product catalog and product inventory service.

It also illustrates how to integrate with FusionAuth's OAuth system using the Authorization Code grant.

It is forked from the [fusionauth-example-node](https://github.com/FusionAuth/fusionauth-example-node) application.

## To run

This assumes you already have a running FusionAuth instance, user and application running locally. If you don't, please see the [5-Minute Setup Guide](https://fusionauth.io/docs/v1/tech/5-minute-setup-guide) to do so.

* update your FusionAuth application to allow a redirect of `http://localhost:3000/oauth-redirect`
* make sure your user has a first name.
* `npm install`
* update `routes/index.js` and `views/index.pug` with the client id of your FusionAuth application.
* update `routes/index.js` with your client secret.
* `npm start`

Go to http://localhost:3000/ and login with the previously created user.

You should see 'Hello <name>'.

Once you've done this, and your services are running (on ports `3001` and `3002`), you should be able to make calls like http://localhost:3000/products.
