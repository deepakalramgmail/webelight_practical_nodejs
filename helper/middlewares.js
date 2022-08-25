const jwt = require('jsonwebtoken');
const multer = require('multer');

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

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/images')
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname)
    }
})

const imageSaveMiddleware = multer({ storage: storage });

module.exports = { routeMiddleWares, imageSaveMiddleware}