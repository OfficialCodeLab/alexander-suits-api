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
			sails.models.cart.findOne({
					user_id: cart_data.user_id
			}).then(success => {
					if (success) {
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
							response.json({
									status: "does_not_exist"
							});
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
							if (success) {
									console.log("Logging success: ", success);
									response.json(success);
							} else {
									response.json({
											status: "does_not_exist"
									});
							}
					}).catch(ex => {
							response.statusCode = 400;
							response.status = 400;
							response.json(ex);
					})
			} else {
					response.statusCode = 400;
					response.status = 400;
					response.json({
							status: "no_id_provided"
					});
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
							if (success) {
									console.log("Logging success: ", success);
									response.json(success);
							} else {
									response.json({
											status: "does_not_exist"
									});
							}
					}).catch(ex => {
							response.statusCode = 400;
							response.status = 400;
							response.json(ex);
					})
			} else {
					response.statusCode = 400;
					response.status = 400;
					response.json({
							status: "no_id_provided"
					});
			}

	},

	getAll: (request, response) => {

			console.log("Received GET for GET ALL ORDERS");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			sails.models.order.find().then(success => {
					if (success) {
							console.log("Logging success: ", success);
							response.json(success);
					} else {
							response.json({
									status: "does_not_exist"
							});
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
			if (order_data.transaction_data) {
					addTransaction(order_data.transaction_data).then(transaction => {
							updateOrder({
									id: order_data.id
							}, order_data).then(order => {
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
					updateOrder({
							id: order_data.id
					}, order_data).then(order => {
							console.log("Logging success: ", order);
							response.json(order);
					}).catch(e => {
							response.statusCode = 400;
							response.status = 400;
							response.json(e);
					})
			}

	},

	/*
	body: {
		status,
		order_string,
		shipping: {
			tracking_number
		}
	}


	*/
	updateStatus: (request, response) => {
			console.log("Received POST for UPDATE Order status");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			console.log("Body: ", JSON.stringify(request.body, null, 4));

			let changes = {
					status: request.body.status
			};

			let original = {
					order_string: request.body.order_string
			};

			sails.models.order.update(original, changes).then(order => {
					if (order.length > 0) {
						console.log(order[0]);
							if (changes.status === 'processing') {
								sendProcessingEmail(order[0]);
									response.status(200).json(order[0]);
							} else if (changes.status === 'shipped') {
									if (!!request.body.delivery.tracking_number) {
											let _delivery = order[0].delivery || {};
											_delivery.tracking_number = request.body.delivery.tracking_number;
											updateOrder(original, {
													delivery: _delivery
											}).then(_order => {
												sendShippedEmail(_order[0]);
												response.status(200).json(_order[0]);
											});
									} else {
										response.status(200).json(order[0]);
									}
							} else {
									response.status(200).json(order[0]);
							}
					} else {
							response.status(400).json("Unable to find product");
					}
			}).catch(e => {
					response.status(400).json(e);
			})
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

function sendShippedEmail(order) {
	return new Promise((resolve, reject) => {
			if (!!order.emails_sent && order.emails_sent.order_shipped === true) {
				console.log("Already done")
					resolve('Already done');
			} else {
					let items = [];
					for (let product of order.products) {
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
							total: order.total.toFixed(2),
							shipping_ref: order.delivery.tracking_number,
							shipper: "DHL"
					};

					console.log(_order);

					return emailService.renderEmailAsync("orderShipped.html", _order).then((html, text) => {
							let subject = "Order Shipped - " + order.order_string;
							let to = order.contact_email + ", support@bloomweddings.co.za";

							return emailService.createMail(html, text, to, subject).then(() => {
									let order_data = {
										emails_sent: order.emails_sent || {}
									};
									order_data.emails_sent.order_shipped = true;
									return updateOrder({
											transaction_id: order.transaction_id
									}, order_data).then(or => {
											if (!!or) {
													resolve(true);
											} else {
													reject("No order found");
											}
									});
							})
					}).catch(ex => {
						console.log(ex);
							reject(ex);
					});
			}

	});
}

function sendProcessingEmail(order) {
	return new Promise((resolve, reject) => {
			if (!!order.emails_sent && order.emails_sent.order_processing === true) {
				console.log("Already done")
					resolve('Already done');
			} else {
					let items = [];
					for (let product of order.products) {
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
					console.log(_order);


					return emailService.renderEmailAsync("orderProcessing.html", _order).then((html, text) => {
							let subject = "Order Processing - " + order.order_string;
							let to = order.contact_email + ", support@bloomweddings.co.za";

							return emailService.createMail(html, text, to, subject).then(() => {
									let order_data = {
											emails_sent: order.emails_sent || {}
									};
									order_data.emails_sent.order_processing = true;
									return updateOrder({
											transaction_id: order.transaction_id
									}, order_data).then(or => {
											if (!!or) {
													resolve(true);
											} else {
													reject("No order found");
											}
									});
							})
					}).catch(ex => {
						console.log(ex);
							reject(ex);
					});
			}

	});
}