const routes = require('express').Router();
const { routeMiddleWares, imageSaveMiddleware } = require('../helper/middlewares');
/* controller */
const auth = require('../controller/auth');
const product = require('../controller/product');
/* controller */

routes.post('/auth/register', routeMiddleWares, auth.register);
routes.post('/auth/login', auth.login);

routes.post('/product/add', routeMiddleWares, imageSaveMiddleware.single('image'), product.add);
routes.put('/product/edit', routeMiddleWares, imageSaveMiddleware.single('image'), product.edit);
routes.delete('/product/:id', routeMiddleWares, product.remove);
routes.get('/product/:id', product.single);
routes.post('/product', product.list);

module.exports = routes;