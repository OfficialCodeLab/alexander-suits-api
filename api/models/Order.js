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
        type: "float",
        decimal2: true
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
    },
    emails_sent: {
      type: "json",
      defaultsTo: {}
    }
  },
  types: {
    decimal2: function(number){
      return ((number *100)%1 === 0);
    }
  },

  beforeCreate: function(obj, next){
    Order.count().exec(function(err, cnt){
        if(err) next(err);
        else{
            let on = cnt + 1;
            let nm = 1040 + on;
            obj['order_number'] = nm;
            obj['order_string'] = "ORD_00" + nm;
            next(null);
        }
    })
}

};
