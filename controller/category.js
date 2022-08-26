const knex = require("knex")(require("../db/db"));

/**
  * @api {get} /api/v1/category categories
  * @apiDescription This API is used to list out category
  * @apiVersion 1.0.0
  * @apiGroup General
  * @apiName categories
  * 
  * @apiSuccess (Success 200) {Number} status Response status code.
  * @apiSuccess (Success 200) {Array} data Response of main data.
  * @apiSuccess (Success 200) {String} message Response message string.
  *
  * @apiSuccessExample {json} Success-Response:
  * 
  * {
  *  "status": 200,
  *   "data": [
  *       {
  *           "id": 1,
  *           "name": "food"
  *       },
  *       {
  *           "id": 2,
  *           "name": "cloth"
  *       }
  *   ],
  *   "message": "category list extracted"
  *  }
*/
const list = async (req, res) => {
    try {
        const categoryList = await knex('categories');
        if (categoryList.length > 0) {
            res.sendSuccess(categoryList, "category list extracted");
        }
        else {
            res.sendSuccess([], "category not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

module.exports = { list }