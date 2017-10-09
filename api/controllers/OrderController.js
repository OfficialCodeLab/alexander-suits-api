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

			let cart_data = request.body;

			// Get products and totals
			sails.models.cart.findOne({user_id: cart_data.user_id}).then(success => {
					if(success) {
						// console.log("Logging success: ", success);
						// response.json(success);
						cart_data.total = success.total;
						cart_data.products = success.products;
						cart_data.status = "Payment Pending";

						//Create order
						sails.models.order.create(cart_data).then(order => {
								console.log("Logging success: ", order);
								response.json(order);
						}).catch(e => {
								response.statusCode = 400;
								response.status = 400;
								response.json(e);
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

	getOrder: (request, response) => {

			console.log("Received GET for GET ORDER");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			if (request.query) {
				let options = request.query;

				sails.models.order.findOne(options).then(success => {
						if(success) {
							console.log("Logging success: ", success);
							response.json(success);
						} else {
							response.json({status:"does_not_exist"});
						}
				}).catch(ex => {
						response.statusCode = 400;
						response.status = 400;
						response.json(ex);
				})
			} else {
					response.statusCode = 400;
					response.status = 400;
					response.json({status:"no_id_provided"});
			}

	},

	getAllUserOrder: (request, response) => {

			console.log("Received GET for GET ALL USER ORDER");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			if (request.query.user_id) {
				let options = {
					user_id: request.query.user_id
				};

				sails.models.order.find(options).then(success => {
						if(success) {
							console.log("Logging success: ", success);
							response.json(success);
						} else {
							response.json({status:"does_not_exist"});
						}
				}).catch(ex => {
						response.statusCode = 400;
						response.status = 400;
						response.json(ex);
				})
			} else {
					response.statusCode = 400;
					response.status = 400;
					response.json({status:"no_id_provided"});
			}

	},

	getAll: (request, response) => {

			console.log("Received GET for GET ALL ORDERS");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			sails.models.order.find().then(success => {
					if(success) {
						console.log("Logging success: ", success);
						response.json(success);
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
			if(order_data.transaction_data) {
				addTransaction(order_data.transaction_data).then(transaction => {
					updateOrder({id: order_data.id}, order_data).then(order=> {
							console.log("Logging success: ", order);
							response.json(order);
					}).catch(ex => {
							response.statusCode = 400;
							response.status = 400;
							response.json(ex);
					})
				}).catch(e => {
						response.statusCode = 400;
						response.status = 400;
						response.json(e);
				})
			} else {
				updateOrder({id: order_data.id}, order_data).then(order=> {
						console.log("Logging success: ", order);
						response.json(order);
				}).catch(e => {
						response.statusCode = 400;
						response.status = 400;
						response.json(e);
				})
			}

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

function addTransaction(transaction_data) {
	return new Promise((resolve, reject) => {
		//Create transaction
		sails.model.transaction.create(transaction_data).then(transaction => {
				resolve(transaction);
		}).catch(e => {
				reject(e);
		})
	});
}
