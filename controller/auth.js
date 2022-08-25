const knex = require("knex")(require("../db/db"));
const sha256 = require("crypto-js/sha256");
const { sendMail } = require("../helper/general_functions");
const general_function = require("../helper/general_functions");

const register = async (req, res) => {
    try {
        const { body } = req;
        const addUser = await knex('users')
            .insert({
                role_id: body.role_id,
                name: body.name,
                email: body.email,
                password: sha256(body.password).toString()
            });
        if (addUser > 0) {
            let mailData = {
                mail_file: 'registrationmail.hbs',
                data: {
                    user_name: `${body.name}`,
                    password: body.password,
                    email: body.email
                },
                to: body.email,
                subject: 'registration'
            }

            await sendMail(mailData)
            res.sendSuccess({}, "customer added successfully");
        }
        else {
            res.sendError("somthing went wrong")
        }
    }
    catch (error) {

        if (error.code == 'ER_DUP_ENTRY') { res.sendError(error.sqlMessage); return false };
        res.sendError(error.message);
    }
}

const login = async (req, res) => {
    try {
        const { body } = req;
        const user = await knex('users as u')
            .select(
                'u.id',
                'u.name',
                'u.email',
                'r.id as role_id',
                'r.name as role_name')
            .leftJoin('roles as r', 'r.id', 'u.role_id')
            .where({ email: body.email, password: sha256(body.password).toString() });
        if (user.length > 0) {
            res.sendSuccess({ ...user[0], token: await general_function.generateJWTToken(user[0]) });
        }
        else {
            res.sendInvalidRequest("email or password was wrong");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports = { login, register }
