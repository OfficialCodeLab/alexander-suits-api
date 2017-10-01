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
	updateTransaction:  (request, response) => {

			console.log("Received POST for UPDATE PAYMENT");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			let payment_data = request.body; //update this later
			let id = payment_data.reference; //update this later
			console.log(payment_data);
			// Check for existing payments in DB
			sails.models.transaction.findOne({id: id}).then(success => {
					console.log("?");
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
					if(!!success) {
						console.log("transaction exists");
						//TODO: update transaction in db first

						// console.log("Logging success: ", success);
						// response.json(success);
						updateOrder({transaction_id: order_string}, order_data).then(order=> {
								if(!!order && order.length > 0) {
									console.log("Logging success: ", order);
									response.statusCode = 200;
									response.status = 200;
									response.json("kthnxbye");
								} else {
									console.log("No order found");
									response.statusCode = 400;
									response.status = 400;
									response.json("No order found");
								}
								// response.json(order);
								//Email user with transaction processing
						}).catch(e => {
								console.log(e);
								response.statusCode = 400;
								response.status = 400;
								response.json(e);
						})
					} else {
						//Handle in future?
							console.log("transaction does not exist");
						sails.models.transaction.create(payment_data).then(transaction => {

								console.log("transaction exists now");
								// cart_data.transaction_data = payment_data;
								// order_data.transaction_data = payment_data;
								console.log(id);

								//Update order
								updateOrder({transaction_id: order_string}, order_data).then(order=>{
									if(!!order) {
										//success
										console.log("Logging success: ", o);
										response.statusCode = 200;
										response.status = 200;
										response.json("kthnxbye");
									} else {
										console.log("No order found");
										response.statusCode = 400;
										response.status = 400;
										//response.json(res.body);
									}

								}).catch(ex=>{
									//error
								})


								// updateOrder({order_string: id}, order_data).then(order=> {
								// 		if(!!order && order.length > 0) {
								// 			console.log("Logging success: ", order);
								// 			response.statusCode = 200;
								// 			response.status = 200;
								// 			response.json("kthnxbye");
								// 		} else {
								// 			console.log("No order found");
								// 			response.statusCode = 400;
								// 			response.status = 400;
								// 			response.json("No order found");
								// 		}
								// 		//Email user with transaction processing
								// }).catch(e => {
								// 		console.log(e);
								// 		response.statusCode = 400;
								// 		response.status = 400;
								// 		response.json(e);
								// })
						}).catch(exc => {
								console.log(exc);
								response.statusCode = 400;
								response.status = 400;
								response.json(exc);
						})
					}
			}).catch(ex => {
					console.log(ex);
					response.statusCode = 400;
					response.status = 400;
					response.json(ex);
			})

	},

	getPaymentOptions:  (request, response) => {

			console.log("Received GET for PAYMENT OPTIONS");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			req.get({
			  url: 'https://api.addpay.co.za/v1/services',
				methods: 'GET',
				headers: {'X-APP-ID': secrets.addPay.app_id, 'X-APP-SECRET': secrets.addPay.app_secret}
			}, function(error, res, body) {
			  if (error) {
			    sails.log.error(error);
			  }
			  else {
					// console.log(response);
			    // sails.log.info(res);
			    // sails.log.info(body);
					response.json(res.body);
			  }
			});

	},

	createTransaction: (request, response) => {

			console.log("Received POST for CREATE PAYMENT");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			let postBody = {
				"method": request.body.method,
			  "reference": request.body.order_string,
			  "description": "I am testing the AddPay API",
			  "payer": {
			    "firstname": "John",
			    "lastname": "Doe",
			    "email": "johndoe@example.org"
			  },
			  "amount": {
			    "currency": "ZAR",
			    "value": "1.50"
			  },
			  "app": {
			    "notify_url": "https://as.api.pear-cap.com/api/transactions/update",
			    "return_url": "http://localhost:4200/payment"
			  },
			  "api": {
			    "mode": "test"
			  }
			};

			//console.log(JSON.stringify(postBody));

			req.post({
			  url: 'https://api.addpay.co.za/v1/transactions',
				methods: 'POST',
				headers: {'X-APP-ID': secrets.addPay.app_id, 'X-APP-SECRET': secrets.addPay.app_secret},
				json: true,
				body: postBody
			}, function(error, res, body) {
			  if (error) {
			    sails.log.error(error);
			  }
			  else {
					// body.push(bodyData);
					// console.log(response);
			    // sails.log.info(res);
			    // sails.log.info(body);
					updateOrder({order_string: order_string}, {transaction_id: res.body.id}).then(order=>{
						if(!!order) {
							//success
							response.json(res.body);
						} else {
							//response.json(res.body);
						}

					}).catch(ex=>{
						//error
					})
			  }
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
