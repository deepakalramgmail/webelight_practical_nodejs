const knex = require("knex")(require("../db/db"));
const sha256 = require("crypto-js/sha256");
const { sendMail } = require("../helper/general_functions");
const general_function = require("../helper/general_functions");

/**
  * @api {post} /api/v1/auth/register register
  * @apiDescription This API is used add the new user
  * @apiVersion 1.0.0
  * @apiGroup Auth
  * @apiName register
  *
  * @apiBody (Parameters) {String} role_id role of the user
  * @apiBody (Parameters) {String} name name of the user
  * @apiBody (Parameters) {String} email email of the user
  * @apiBody (Parameters) {String} password password of the user
  *
  * @apiParamExample {json} Request-Example:
  * {
  *     "role_id":"2",
  *     "name":"Customer user",
  *     "email":"customeruser@mailinator.com",
  *     "password":"customeruser@123",
  * }
  *
  * @apiSuccess (Success 200) {Number} status Response status code.
  * @apiSuccess (Success 200) {JSON} data Response of main data.
  * @apiSuccess (Success 200) {String} message Response message string.
  *
  * @apiSuccessExample {json} Success-Response:
  * {
  *     "status": 200,
  *     "data": {},
  *     "message": "customer added successfully"
  * }
*/
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

/**
  * @api {post} /api/v1/auth/login login
  * @apiDescription This API is used to login in application for admin / user
  * @apiVersion 1.0.0
  * @apiGroup Auth
  * @apiName login
  * 
  * @apiBody (Parameters) {String} email name of the user
  * @apiBody (Parameters) {String} password password of the user
  *
  * @apiParamExample {application/json} Request-Example:
  * {
  *     "email":"customeruser@mailinator.com",
  *     "password":"customeruser@123",
  * }
  *
  * @apiSuccess (Success 200) {Number} status Response status code.
  * @apiSuccess (Success 200) {JSON} data Response of main data.
  * @apiSuccess (Success 200) {String} message Response message string.
  *
  * @apiSuccessExample {json} Success-Response:
  * {
  *     "status": 200,
  *     "data": {
  *         "id": 5,
  *         "name": "Customer user",
  *         "email": "customeruser@mailinator.com",
  *         "role_id": 2,
  *         "role_name": "customer",
  *         "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImN1c3RvbWVydXNlckBtYWlsaW5hdG9yLmNvbSIsImlkIjo1LCJyb2xlX2lkIjoyLCJyb2xlX25hbWUiOiJjdXN0b21lciIsImlhdCI6MTY2MTUyOTY4OSwiZXhwIjoxNjYxNTcyODg5fQ.r3cmNvpf1QbibUkGEUMJGIrVPys-jqjq6e_qbw0Bo4A"
  *     }
  * }
*/
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
