/**
 * Product.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    tableName: "products",
    connection: "suits_mongo",

    attributes: {
        name: {
            type: "string",
            required: true
        },
        description: {
            type: "string",
            required: false
        },
        category: {
            type: "string",
            required: true
        },
        price: {
            type: "integer",
            required: true
        },
        extras: {
            type: "object",
            defaultsTo: {}
        },
        image_urls: {
            type: "Array",
            defaultsTo: []
        },
        estimated_stock_remaining: {
            type: "integer"
        }
    }
};
