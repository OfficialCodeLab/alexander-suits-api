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
			let id = payment_data.id; //update this later
			console.log(payment_data);
			response.statusCode = 200;
			response.status = 200;
			response.json("kthnxbye");
			//Check for existing payments in DB
			// sails.models.transaction.findOne({id: id}).then(success => {
			// 		let order_data = {
			// 			status: payment_data.status.state //This is addPay only
			// 		};
			// 		if(success) {
			// 			// console.log("Logging success: ", success);
			// 			// response.json(success);
			// 			updateOrder({transaction_id: id}, order_data).then(order=> {
			// 					console.log("Logging success: ", order);
			// 					response.json(order);
			// 					//Email user with transaction processing
			// 			}).catch(e => {
			// 					response.statusCode = 400;
			// 					response.status = 400;
			// 					response.json(e);
			// 			})
			// 		} else {
			// 			//Handle in future?
			// 			mails.model.transaction.create(payment_data).then(transaction => {
			// 					cart_data.transaction_data = transaction_data;
			//
			// 					//Update order
			// 					updateOrder(order_data).then(order=> {
			// 							console.log("Logging success: ", order);
			// 							response.json(order);
			// 							//Email user with transaction processing
			// 					}).catch(e => {
			// 							response.statusCode = 400;
			// 							response.status = 400;
			// 							response.json(e);
			// 					})
			// 			}).catch(exc => {
			// 					response.statusCode = 400;
			// 					response.status = 400;
			// 					response.json(exc);
			// 			})
			// 		}
			// }).catch(ex => {
			// 		response.statusCode = 400;
			// 		response.status = 400;
			// 		response.json(ex);
			// })

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
				"method": "standard_card",
			  "reference": "MyFirstPaymentRequest",
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
			    "return_url": "http://localhost:4200/"
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
					response.json(res);
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
