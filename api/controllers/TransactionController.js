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
        let id = payment_data.id;
        // Check for existing payments in DB
        sails.models.transaction.findOne({
            id: id
        }).then(success => {
            let order_data;
            if (payment_data.status === 0) {
                order_data = {
                    status: "processed",
                    transaction_data: payment_data
                };
            } else {
                order_data = {
                    status: payment_data.status.state, //This is addPay only
                    transaction_data: payment_data
                };
            }
            if (!!success) {
                //TODO: update transaction in db first
                return sails.models.transaction.update({
                    id: id
                }, payment_data).then(transaction => {
                    if (!!transaction) {
                        return updateOrder({
                            transaction_id: id
                        }, order_data).then(order => {
                            if (!!order) {
                                if (order.status === "processed") {
                                    this.completeOrder();
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
            if (or.status === "processed" || or.status === "in_progress" || or.status === "shipped" || or.status === "completed" || or.status === "cancelled_final") {
                response.statusCode = 400;
                response.status = 400;
                response.json("Order already processed");
            } else {
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
                        "value": or.total
                    },
                    "app": {
                        "notify_url": "https://as.api.pear-cap.com/api/transactions/update",
                        "return_url": request.headers.origin + "/payment"
                    },
                    "api": {
                        "mode": "test"
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
                    if (error) {
                        sails.log.error(error);
                    } else {
                        updateOrder({
                            order_string: request.body.order_string
                        }, {
                            transaction_id: res.body.id
                        }).then(order => {
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
        resolve(true);
    });
    //complete order here
}
