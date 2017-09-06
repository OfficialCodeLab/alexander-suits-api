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
            type: "string"
        },
        email: {
            type: "string",
            required: true,
            unique: true
        },
        contact_mobile: {
            type: "string"
        },
        address: {
            type: "string"
        },
        address2: {
            type: "string"
        },
        city: {
            type: "string"
        },
        province: {
            type: "string"
        },
        postal_code: {
            type: "string"
        },
        country: {
            type: "string",
            defaultsTo: "South Africa"
        },
        carts: {
            type: "Array",
            defaultsTo: []
        },
        orders: {
            type: "Array",
            defaultsTo: []
        },
        user_id: {
            type: "string",
            required: true,
            unique: true
        },
        status: {
            type: "string"
        },
    }
};
