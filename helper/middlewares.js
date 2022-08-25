const jwt = require('jsonwebtoken');

const routeMiddleWares = async (req, res, next) => {
    const bearerHeader = req.headers['x-access-token'] || req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const token = bearerHeader.split(' ')[1];
        return jwt.verify(token, process.env.SECRETKEY, async (err, userData) => {
            if (err) {
                res.sendForbidden(err.toString());
            }
            else {
                req.loginUser = userData;
                next();
            }
        })
    }
    else {
        res.sendUnAuthorized("token missing")
    }
}

module.exports = { routeMiddleWares }