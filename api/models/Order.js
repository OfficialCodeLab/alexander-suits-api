/**
 * Order.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName: "orders",
  connection: "suits_mongo",
  attributes: {
    user_id: {
        type: "string",
        required: true
    },
    order_number: {
        type: 'integer',
        unique: true,
        autoIncrement: true
    },
    order_string: {
        type: 'string'
    },
    transaction_data: {
        type: "json",
        defaultsTo: {}
    },
    transaction_id: {
        type: "string"
    },
    user_data: {
        type: "json",
        defaultsTo: {}
    },
    delivery: {
        type: "json",
        defaultsTo: {}
    },
    address_data: {
        type: "json",
        defaultsTo: {}
    },
    contact_number: {
      type: "string",
    },
    contact_email: {
      type: "string",
    },
    products: {
        type: "Array",
        defaultsTo: []
    },
    comments: {
        type: "Array",
        defaultsTo: []
    },
    total: {
        type: "integer"
    },
    status: {
        type: "string"
    },
    completed: {
        type: "datetime"
    },
    agent_data: {
        type: "json",
        defaultsTo: {}
    }
  }
};
