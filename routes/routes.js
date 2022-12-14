const routes = require('express').Router();
const { routeMiddleWares, imageSaveMiddleware, roleAccess } = require('../helper/middlewares');
/* controller */
const auth = require('../controller/auth');
const product = require('../controller/product');
const category = require('../controller/category');
/* controller */

routes.post('/auth/register', routeMiddleWares, roleAccess(['admin']), auth.register);
routes.post('/auth/login', auth.login);

routes.post('/product/add', routeMiddleWares, roleAccess(['admin']), imageSaveMiddleware.single('image'), product.add);
routes.put('/product/edit', routeMiddleWares, roleAccess(['admin']), imageSaveMiddleware.single('image'), product.edit);
routes.delete('/product/:id', routeMiddleWares, roleAccess(['admin']), product.remove);
routes.get('/product/:id', product.single);
routes.post('/product', product.list);

routes.get('/category', category.list);

module.exports = routes;