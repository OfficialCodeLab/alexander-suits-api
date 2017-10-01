/**
 * Cart.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

    tableName: "carts",
    connection: "suits_mongo",

    attributes: {

      user_id: {
          type: "string",
          required: true,
          unique: true
      },
      products: {
          type: "Array",
          defaultsTo: []
      },
      total: {
          type: "float",
          decimal2: true
      },
      status: {
          type: "string"
      },
    },

    types: {
      decimal2: function(number){
        return ((number *100)%1 === 0);
      }
    },
};
