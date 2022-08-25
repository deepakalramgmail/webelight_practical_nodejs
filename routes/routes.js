const routes = require('express').Router();

/* controller */
const auth = require('../controller/auth');
/* controller */

routes.get('/', auth.test);

module.exports = routes;