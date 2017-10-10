/**
 * TransactionController
 *
 * @description :: Server-side logic for managing transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
let req = require('request');
let rek = require('rekuire');
let secrets = rek('secrets/secrets.js');

module.exports = {

    updateTransaction: (request, response) => {

        console.log("Received POST for UPDATE PAYMENT");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");
        console.log("FROM: " + request.headers.origin);

        let payment_data = request.body;
        console.log(payment_data);
        let id = payment_data.id;
        // Check for existing payments in DB
        sails.models.transaction.findOne({
            id: id
        }).then(success => {
            let order_data  = {
                transaction_data: payment_data
            };
            let status = getStatus(payment_data.status);
            order_data.status = status;
            payment_data.status_english = status;

            if (!!success) {
                return sails.models.transaction.update({
                    id: id
                }, payment_data).then(transaction => {
                    if (!!transaction) {
                        return updateOrder({
                            transaction_id: id
                        }, order_data).then(order => {
                            if (!!order) {
                                if (order.status === "payment_processed") {
                                    completeOrder(order).then(()=>{
                                      console.log("success");
                                    }).catch(ex => {
                                      console.log("failure");
                                    });
                                }
                                response.statusCode = 200;
                                response.status = 200;
                                response.json("kthnxbye");
                                //Email user with transaction processing
                            } else {
                                return Promise.reject("No order found!")
                            }
                        })
                    } else {
                        return Promise.reject("Transaction update failed");
                    }
                })
            } else {
                //Create transaction
                return sails.models.transaction.create(payment_data).then(transaction => {
                    // order_data.transaction_data = payment_data;

                    //Update order
                    return updateOrder({
                        transaction_id: id
                    }, order_data).then(order => {
                        if (!!order) {
                            if (order.status === "processed") {
                                this.completeOrder();
                            }
                            //success
                            response.statusCode = 200;
                            response.status = 200;
                            response.json("kthnxbye");
                            //Email user with transaction processing
                        } else {
                            return Promise.reject("No order found!")
                        }

                    })
                })
            }
        }).catch(ex => {
            console.log(ex);
            response.statusCode = 400;
            response.status = 400;
            response.json(ex);
        })

    },

    getPaymentOptions: (request, response) => {

        console.log("Received GET for PAYMENT OPTIONS");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        req.get({
            url: 'https://api.addpay.co.za/v1/services',
            methods: 'GET',
            headers: {
                'X-APP-ID': secrets.addPay.app_id,
                'X-APP-SECRET': secrets.addPay.app_secret
            }
        }, function(error, res, body) {
            if (error) {
                sails.log.error(error);
            } else {
                response.json(res.body);
            }
        });

    },

    createTransaction: (request, response) => {

        console.log("Received POST for CREATE PAYMENT");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");
        console.log("Return URL: " + request.headers.origin + "/payment");
        sails.models.order.findOne({
            order_string: request.body.order_string
        }).then(or => {
            if (or.status === "processed" || or.status === "in_progress" || or.status === "shipped" || or.status === "completed" || or.status === "cancelled_final" || or.status === "payment_processed") {
                response.statusCode = 400;
                response.status = 400;
                response.json("Order already processed");
            } else {
                if(request.body.method === "offline_payment") {
                    completeOrder(or).then(() => {
                      console.log("success");
                    });
                }
                let names = or.user_data.name.split(' ');
                let postBody = {
                    "method": request.body.method,
                    "reference": request.body.order_string,
                    "description": "Alexander Suits Payment",
                    "payer": {
                        "firstname": names[0],
                        "lastname": names[names.length - 1],
                        "email": or.contact_email
                    },
                    "amount": {
                        "currency": "ZAR",
                        "value": 250
                    },
                    "app": {
                        "notify_url": "https://as.api.pear-cap.com/api/transactions/update",
                        "return_url": request.headers.origin + "/payment"
                    },
                    "api": {
                        "mode": "live"
                    }
                };

                // console.log(JSON.stringify(postBody));

                req.post({
                    url: 'https://api.addpay.co.za/v1/transactions',
                    methods: 'POST',
                    headers: {
                        'X-APP-ID': secrets.addPay.app_id,
                        'X-APP-SECRET': secrets.addPay.app_secret
                    },
                    json: true,
                    body: postBody
                }, function(error, res, body) {
                  console.log(res.body);
                    if (error) {
                        sails.log.error(error);
                    } else {
                      let orderUpdate = {
                          transaction_id: res.body.id
                      };
                      if(request.body.method === "offline_payment") {
                        orderUpdate.status = "awaiting_eft"
                      } else {
                        orderUpdate.status = "awaiting_payment"
                      }
                        updateOrder({
                            order_string: request.body.order_string
                        }, orderUpdate).then(order => {
                            if (!!order) {
                                //success
                                // console.log("Logging success: ", order);
                                response.json(res.body);
                            } else {
                                response.statusCode = 400;
                                response.status = 400;
                                response.json("No order found");
                            }
                        }).catch(ex => {
                            //error
                            console.log("HMM", ex);
                            response.statusCode = 400;
                            response.status = 400;
                            response.json(ex);
                        });
                    }
                });
            }

        }).catch(e => {
            console.log("WUT", e);
            response.statusCode = 400;
            response.status = 400;
            response.json(e);
        });

    },


};

function updateOrder(order, order_data) {
    return new Promise((resolve, reject) => {
        sails.models.order.update(order, order_data).then(o => {
            resolve(o);
        }).catch(e => {
            reject(e);
        })
    });
}

function completeOrder(order) {
    return new Promise((resolve, reject) => {
        //complete order here
        let items = [];
        for(let product of order.products) {
          let item = {
            name: product.name,
            desc: product.description,
            count: product.count,
            subtotal: (product.price * product.count).toFixed(2)
          };
          items.push(item);
        }

        let _order = {
          number: order.order_string,
          items: items,
          total: order.total.toFixed(2)
        };

        return emailService.renderEmailAsync("orderPlaced.html", _order).then((html, text) => {
          let subject = "Order Placed - " + order.order_string;
          let to = order.contact_email + ", support@bloomweddings.co.za";

          return emailService.createMail(html, text, to, subject).then(() => {
            resolve(true);
          })
        }).catch(ex => {
          reject(ex);
        });
    });
}

function getStatus(status) {
  let _status;
  switch(status) {
    case 0: //PAYMENT_PROCESSED
      _status = "payment_processed";
      break;

    case 1: //PAYMENT_PENDING
      _status = "payment_pending";
      break;

    case 2: //PAYMENT_CANCELLED
      _status = "failed";
      break;

    case 3: //PAYMENT_REFUNDED
      _status = "failed";
      break;

    case 4: //PAYMENT_FAILED
      _status = "failed";
      break;

    case 10: //PAYMENT_3DPENDING
      _status = "payment_pending";
      break;

    case 11: //PAYMENT_3DAUTHED
      _status = "payment_processed";
      break;

    default: //UNKNOWN
      _status = payment_data.status;
      break;
  }
  return _status;
}
