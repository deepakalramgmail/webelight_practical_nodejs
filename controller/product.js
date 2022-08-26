const knex = require("knex")(require("../db/db"));

/**
  * @api {post} /api/v1/product/add add-product
  * @apiDescription This API is used for add card
  * @apiVersion 1.0.0
  * @apiGroup Product
  * @apiName add-product
  *
  * @apiHeader {String} Authorization `Bearer token` 
  * 
  * @apiBody (Parameters) {String} image image of product
  * @apiBody (Parameters) {String} name name of the product
  * @apiBody (Parameters) {String} description description of product
  * @apiBody (Parameters) {Number} category category of product
  * @apiBody (Parameters) {Number} quantity quantity of product
  * @apiBody (Parameters) {Number} price price of product
  *
  * @apiParamExample {json} Request-Example:
  * {
  *     "image":"demo.png",
  *     "name":"Test Product",
  *     "description":"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  *     "category":1,
  *     "quantity":30,
  *     "price":100,
  * }
  *
  * @apiSuccess (Success 200) {Number} status Response status code.
  * @apiSuccess (Success 200) {Array} data Response of main data.
  * @apiSuccess (Success 200) {String} message Response message string.
  *
  * @apiSuccessExample {json} Success-Response:
  * {
  *  "status": 200,
  *  "data": [],
  *  "message": "product added successfully"
  *  }
*/
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

/**
  * @api {post} /api/v1/product products
  * @apiDescription This API is used to get card list
  * @apiVersion 1.0.0
  * @apiGroup Product
  * @apiName products
  * 
  * @apiBody (Parameters) {String} page page count of the page
  * @apiBody (Parameters) {String} limit per page data limit (like 10 records or 5 records)
  * @apiBody (Parameters) {String} search_word your search key word
  * @apiBody (Parameters) {String} category category id 
  * @apiBody (Parameters) {String} start_range price start range
  * @apiBody (Parameters) {String} end_range price end range
  *
  * @apiParamExample {json} Request-Example:
  *  {
  *      "limit": 10,
  *      "page": 1,
  *      "search_word":"d",
  *      "category":1,
  *      "start_range":30,
  *      "end_range":90
  *  }
  *
  * @apiSuccess (Success 200) {Number} status Response status code.
  * @apiSuccess (Success 200) {Array} data Response of main data.
  * @apiSuccess (Success 200) {String} message Response message string.
  *
  * @apiSuccessExample {json} Success-Response:
  *  {
  *      "status": 200,
  *      "data": [
  *          {
  *              "id": 5,
  *              "image": "sample.png",
  *              "product_name": "Test Product",
  *              "description": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ",
  *              "category": 1,
  *              "quantity": 19,
  *              "price": "30",
  *              "category_name": "food"
  *          }
  *      ],
  *      "message": "Products extracted"
  *  }
*/
const list = async (req, res) => {
    try {
        const { body } = req;
        const offset = (body.page - 1) * body.limit;
        const productList = await knex('products as p')
            .select('p.id', 'p.image', 'p.name as product_name', 'p.description', 'p.category', 'p.quantity', 'p.price', 'c.name as category_name')
            .leftJoin('categories as c', 'c.id', 'p.category')
            .where((qb) => {
                if (body.search_word) {
                    qb.where('p.name', 'like', `%${body.search_word}%`);
                }

                if (body.category) {
                    qb.where({ 'p.category': body.category });
                }

                if (body.start_range && body.end_range) {
                    qb.whereBetween('p.price', [body.start_range, body.end_range]);
                }
            })
            .limit(body.limit)
            .offset(offset)
            .orderBy('p.id', 'desc');

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

/**
  * @api {get} /api/v1/product/:id single-product
  * @apiDescription This API is used to get single product details list out documenttype
  * @apiVersion 1.0.0
  * @apiGroup Product
  * @apiName single-product
  *
  * @apiParam {Number} id product unique ID.
  *
  * @apiSuccess (Success 200) {Number} status Response status code.
  * @apiSuccess (Success 200) {Array} data Response of main data.
  * @apiSuccess (Success 200) {String} message Response message string.
  *
  * @apiSuccessExample {json} Success-Response:
  * 
  *  {
  *      "status": 200,
  *      "data": {
  *          "id": 5,
  *          "image": "sample.png",
  *          "product_name": "Test Product",
  *          "description": "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. ",
  *          "category": 1,
  *          "quantity": 19,
  *          "price": "30",
  *          "category_name": "food"
  *      },
  *      "message": "product details extracted"
  *  }
*/
const single = async (req, res) => {
    try {
        const { id } = req.params;
        const singleProduct = await await knex('products as p')
            .select('p.id', 'p.image', 'p.name as product_name', 'p.description', 'p.category', 'p.quantity', 'p.price', 'c.name as category_name')
            .leftJoin('categories as c', 'c.id', 'p.category')
            .where({ 'p.id': id });
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

/**
  * @api {put} /api/v1/product/edit edit-product
  * @apiDescription This API is used for edit product
  * @apiVersion 1.0.0
  * @apiGroup Product
  * @apiName edit-product
  * 
  * @apiHeader {String} Authorization `Bearer token` 
  * 
  * @apiBody (Parameters) {String} image image of product
  * @apiBody (Parameters) {String} name name of the product
  * @apiBody (Parameters) {String} description description of product
  * @apiBody (Parameters) {Number} category category of product
  * @apiBody (Parameters) {Number} quantity quantity of product
  * @apiBody (Parameters) {Number} price price of product
  *
  * @apiParamExample {json} Request-Example:
  * {
  *     "image":"demo.png",
  *     "name":"Test Product",
  *     "description":"It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.",
  *     "category":1,
  *     "quantity":30,
  *     "price":100,
  * }
  *
  * @apiSuccess (Success 200) {Number} status Response status code.
  * @apiSuccess (Success 200) {Array} data Response of main data.
  * @apiSuccess (Success 200) {String} message Response message string.
  *
  * @apiSuccessExample {json} Success-Response:
  * {
  *  "status": 200,
  *  "data": [],
  *  "message": "product details updated successfully"
  *  }
*/
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

/**
  * @api {delete} /api/v1/product/:id delete-product
  * @apiDescription This API is used to delete product
  * @apiVersion 1.0.0
  * @apiGroup Product
  * @apiName delete-product
  *
  * @apiHeader {String} Authorization `Bearer token` 
  * 
  * @apiParam {Number} id product unique ID.
  *
  * @apiSuccess (Success 200) {Number} status Response status code.
  * @apiSuccess (Success 200) {Array} data Response of main data.
  * @apiSuccess (Success 200) {String} message Response message string.
  *
  * @apiSuccessExample {json} Success-Response:
  * {
  *     "status": 200,
  *     "data": [],
  *     "message": "product deleted successfully"
  * }
*/
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