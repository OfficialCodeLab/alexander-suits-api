/**
 * OrderController
 *
 * @description :: Server-side logic for managing orders
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	createOrder: (request, response) => {
			console.log("Received POST for CREATE ORDER");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			let cart_data = request.body.cart_data;
			let transaction_data = request.body.transaction_data;

			// Get products and totals
			sails.models.cart.findOne({user_id: cart_data.user_id}).then(success => {
					if(success) {
						// console.log("Logging success: ", success);
						// response.json(success);
						cart_data.total = success.total;
						cart_data.products = success.products;
						cart_data.status = "Payment Pending";
						cart_data.transaction_data = transaction_data;
						cart_data.transaction_id = transaction_data.id;

						//Create transaction
						mails.model.transaction.create(transaction_data).then(transaction => {
								cart_data.transaction_data = transaction_data;

								//Create order
								sails.models.order.create(cart_data).then(order => {
										console.log("Logging success: ", order);
										response.json(order);
								}).catch(e => {
										response.statusCode = 400;
										response.status = 400;
										response.json(e);
								})
						}).catch(exc => {
								response.statusCode = 400;
								response.status = 400;
								response.json(exc);
						})

					} else {
						response.json({status:"does_not_exist"});
					}
			}).catch(ex => {
					response.statusCode = 400;
					response.status = 400;
					response.json(ex);
			})
	},

	updateOrder: (request, response) => {

			console.log("Received POST for UPDATE ORDER");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			let order_data = request.body;
			// Get products and totals
			updateOrder({id: order_data.id}, order_data).then(order=> {
					console.log("Logging success: ", order);
					response.json(order);
			}).catch(e => {
					response.statusCode = 400;
					response.status = 400;
					response.json(e);
			})

	},

	paymentUpdate:  (request, response) => {

			console.log("Received POST for UPDATE PAYMENT");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			let payment_data = request.body;
			let id = payment_data.id;
			//Check for existing payments in DB
			sails.models.transaction.findOne({id: id}).then(success => {
					let order_data = {
						status = payment_data.status.state
					};
					if(success) {
						// console.log("Logging success: ", success);
						// response.json(success);
						updateOrder({transaction_id: id}, order_data).then(order=> {
								console.log("Logging success: ", order);
								response.json(order);
								//Email user with transaction processing
						}).catch(e => {
								response.statusCode = 400;
								response.status = 400;
								response.json(e);
						})
					} else {
						//Handle in future?
						mails.model.transaction.create(payment_data).then(transaction => {
								cart_data.transaction_data = transaction_data;

								//Update order
								updateOrder(order_data).then(order=> {
										console.log("Logging success: ", order);
										response.json(order);
										//Email user with transaction processing
								}).catch(e => {
										response.statusCode = 400;
										response.status = 400;
										response.json(e);
								})
						}).catch(exc => {
								response.statusCode = 400;
								response.status = 400;
								response.json(exc);
						})
					}
			}).catch(ex => {
					response.statusCode = 400;
					response.status = 400;
					response.json(ex);
			})

	},
};

function updateOrder(order, order_data) {
	return new Promise((resolve, reject) = {
		sails.models.order.update(order, order_data).then(o => {
				resolve(o);
		}).catch(e => {
				reject(e);
		})
	});
}
