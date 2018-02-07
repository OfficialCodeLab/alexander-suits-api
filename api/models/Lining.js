/**
 * Lining.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    tableName: "linings",
    connection: "suits_mongo",

    attributes: {
        lining_SKU: {
            type: "string",
            unique: true,
            required: true
        },
        article_number: {
            type: "string"
        },
        colour_number: {
            type: "string"
        },
        name: {
            type: "string",
            required: true
        },
        description: {
            type: "string",
            required: false
        },
        description_long: {
            type: "string",
            required: false
        },
        print: {
            type: "string",
        },
        primary_colour: {
            type: "string",
        },
        price_category: {
            type: "string",
        },
        price: {
            type: "float",
            decimal2: true,
            required: true
        },
        image_urls: {
            type: "Array",
            defaultsTo: []
        },
        estimated_stock_remaining: {
            type: "float",
            decimal2: true,
        },
        supplier_name: {
            type: "string",
        },
    },
    types: {
      decimal2: function(number){
        return ((number *100)%1 === 0);
      }
    },
};
