const knex = require("knex")(require("../db/db"));

const add = async (req, res) => {
    try {
        const { body, file } = req;
        const productCheck = await knex('products').where({ name: body.name, category: body.category });
        if (productCheck.length > 0) {
            res.sendInvalidRequest("Product already available for this category");
        }
        else {
            const addProduct = await knex('products')
                .insert({
                    image: file ? file.originalname : 'product_default.jpeg',
                    name: body.name,
                    description: body.description,
                    category: body.category,
                    quantity: body.quantity,
                    price: body.price
                });
            if (addProduct > 0) {
                res.sendSuccess({}, "Product added successfully");
            }
            else {
                res.sendError("somthing went wrong");
            }
        }
    }
    catch (error) {
        res.sendError(error.message)
    }
}

const list = async (req, res) => {
    try {
        const { body } = req;
        const offset = (body.page - 1) * body.limit;
        const productList = await knex('products')
            .where((qb) => {
                if (body.search_word) {
                    qb.where('name', 'like', `%${body.search_word}%`);
                }

                if (body.category) {
                    qb.where({ category: body.category });
                }

                if (body.start_range && body.end_range) {
                    qb.whereBetween('price', [body.start_range, body.end_range]);
                }
            })
            .limit(body.limit)
            .offset(offset)
            .orderBy('id', 'desc');

        if (productList.length > 0) {
            res.sendSuccess(productList, "Products extracted");
        }
        else {
            res.sendSuccess([], "products not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

const single = async (req, res) => {
    try {
        const { id } = req.params;
        const singleProduct = await knex('products').where({ id: id });
        if (singleProduct.length > 0) {
            res.sendSuccess(singleProduct[0], "product details extracted");
        }
        else {
            res.sendError("product details not available");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

const edit = async (req, res) => {
    try {
        const { body } = req;
        const reqObj = {
            name: body.name,
            description: body.description,
            category: body.category,
            quantity: body.quantity,
            price: body.price
        }

        if (req.file) { reqObj.image = file.originalname }

        const editProduct = await knex('products')
            .update(reqObj)
            .where({ id: body.id });
        if (editProduct > 0) {
            res.sendSuccess({}, "product details updated successfully");
        }
        else {
            res.sendError("product not updated");
        }
    }
    catch (error) {
        res.sendError(error.message);
    }
}

const remove = async (req, res) => {
    try {
        const { id } = req.params;
        const removeProduct = await knex('products').where({ id: id }).delete();
        if (removeProduct > 0) {
            res.sendSuccess({}, "product deleted successfully");
        }
        else {
            res.sendError("somthing went wrong")
        }
    }
    catch (error) {
        res.sendError(error.message)
    }
}

module.exports = { add, list, single, edit, remove }