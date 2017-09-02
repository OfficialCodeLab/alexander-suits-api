/**
 * User.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {


    tableName: "users",
    connection: "suits_mongo",

    attributes: {
        fullname: {
            type: "string",
            required: true
        },
        email: {
            type: "string",
            required: true,
            unique: true
        },
        password: {
            type: "string",
            required: true
        },
        contact_mobile: {
            type: "string"
        },
        carts: {
            type: "Array",
            defaultsTo: []
        },
        orders: {
            type: "Array",
            defaultsTo: []
        }
    }
};

