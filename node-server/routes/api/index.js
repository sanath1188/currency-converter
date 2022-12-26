const api = require("express").Router();
const user = require('./user');
const currency = require('./currency');
const conversion = require('./conversion');

/**
 * Add in all the routes you create here.
 * This is just a test route.
 */
 api.use(user);
 api.use(currency);
 api.use(conversion);

module.exports = api;