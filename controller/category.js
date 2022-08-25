const e = require("express");

const knex = require("knex")(require("../db/db"));

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