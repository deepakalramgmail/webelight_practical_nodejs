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

const roleAccess = (roleType) => {
    return (req, res, next) => {
        if (req.loginUser) {
            if (roleType.length > 0) {
                let checkUser = roleType.filter(x => x === req.loginUser.role_name)
                if (checkUser.length === 0) {
                    return res.sendForbidden("You didn't have permission to access this route!!");
                }
                else {
                    next();
                }
                console.log("check  2")
            }
            console.log("check  1")
        }

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

module.exports = { routeMiddleWares, imageSaveMiddleware, roleAccess }