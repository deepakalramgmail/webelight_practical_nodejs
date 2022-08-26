const path = require('path');
const dotenv = require('dotenv');

/* set environment */
dotenv.config({
    path: path.resolve(__dirname, `./env/${process.env.NODE_ENV}.env`)
});
/* set environment */
console.log(`environment set ${process.env.NODE_ENV}`);

const http = require('http');
const express = require('express');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 1000000 }));

app.use(cors())

/* apidoc  */
app.use('/apidoc', express.static('./apidoc'));
/* apidoc  */

app.use(express.static(__dirname + '/public'));

app.use('/api/v1', require('./routes/routes'));

/* Express Custom Function */
require("./common/express_custom_function")(express);

server.listen(process.env.PORT || 3005, (err) => {
    if (err) throw (err);
    console.log('Server Up And Working');
    console.log("====================================>");
    console.log("ADMIN USER ", { email: 'adminuser@mailinator.com', password: "adminuser@123" });
    console.log("CUSTOMER ", { email: 'customeruser@mailinator.com', password: "customeruser@123" });
    console.log("====================================>");
});
