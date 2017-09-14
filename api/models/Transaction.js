/**
 * Transaction.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  tableName: "transactions",
  connection: "suits_mongo",
  attributes: {
    id: {
        type: "string",
        required: true,
        unique: true
    },
    method: {
        type: "string"
    },
    status: {
        type: "string"
    },
    isTest: {
        type: "string"
    },
    amount: {
        type: "double"
    },
    reference: {
        type: "string"
    },
    currency_code: {
        type: "string"
    },
    additional_info: {
        type: "json",
        defaultsTo: {}
    }
  }
};
