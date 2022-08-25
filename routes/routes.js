const routes = require('express').Router();
const { routeMiddleWares } = require('../helper/middlewares');
/* controller */
const auth = require('../controller/auth');
/* controller */

routes.post('/auth/register', routeMiddleWares, auth.register);
routes.post('/auth/login', auth.login);

module.exports = routes;