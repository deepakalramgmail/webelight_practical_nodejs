const jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require("path");
const nodemailer = require("nodemailer");
const handlebars = require("handlebars");
const { google } = require('googleapis');

const OAuth2_client = new google.auth.OAuth2(process.env.CLIENTID, process.env.CLIENTSECRETKEY);
OAuth2_client.setCredentials({ refresh_token: process.env.REFRSHTOKEN });

const generateJWTToken = async (payload) => {
    return jwt.sign({ email: payload.email, id: payload.id, role_id: payload.role_id, role_name: payload.role_name }, process.env.SECRETKEY, { expiresIn: "12h" });
}

const sendMail = async (mail) => {
    try {
        const accessToken = OAuth2_client.getAccessToken()
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.NODEMAILERUSER,
                clientId: process.env.CLIENTID,
                clientSecret: process.env.CLIENTSECRETKEY,
                refreshToken: process.env.REFRSHTOKEN,
                accessToken: accessToken
            }
        });
        const html = fs.readFileSync(path.join(__dirname, `../views/${mail.mail_file}`), 'utf8');
        const template = handlebars.compile(html)(mail.data);
        const mailOptions = {
            from: '"noreply@test.com "<noreply@test.com>',
            to: mail.to,
            subject: mail.subject,
            html: template,
        };
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) { console.log(error); return false }
        });
    }
    catch (error) { console.error(error); return false }
}

module.exports = { generateJWTToken, sendMail }