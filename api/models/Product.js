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
        product_SKU: {
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
        category: {
            type: "string",
            required: true
        },
        print: {
            type: "string",
        },
        print_type: {
            type: "string",
        },
        primary_colour: {
            type: "string",
        },
        secondary_colours: {
            type: "Array",
            defaultsTo: []
        },
        fabric_type: {
            type: "string",
        },
        fabric_subtype: {
            type: "string",
        },
        weave_description: {
            type: "string",
        },
        collections: {
            type: "Array",
            defaultsTo: []
        },
        price_category: {
            type: "string",
        },
        price: {
            type: "float",
            decimal2: true,
            required: true
        },
        extras: {
            type: "json",
            defaultsTo: {}
        },
        image_urls: {
            type: "Array",
            defaultsTo: []
        },
        estimated_stock_remaining: {
            type: "float",
            decimal2: true,
        }
    },
    types: {
      decimal2: function(number){
        return ((number *100)%1 === 0);
      }
    },
};
