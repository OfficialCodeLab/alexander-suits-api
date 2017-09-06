/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	createCart: (request, response) => {
			console.log("Received POST for CREATE CART");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			sails.models.cart.create(request.body).then(success => {
					console.log("Logging success: ", success);
					response.json(success);
			}).catch(ex => {
					response.statusCode = 400;
					response.status = 400;
					response.json(ex);
			})
	},

	updateCart: (request, response) => {
			console.log("Received POST for UPDATE CART");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			// console.log(request.body)

			//set up product and calc price
			let products = request.body.products;
			let promises = [];
			for (let product of products) {
				let promise = new Promise((resolve, reject) => {
					let options = {
						product_SKU: product.product_SKU
					};
					sails.models.product.findOne(options).then(success => {
							if(success) {
								console.log("Found product: ", success);
								let p = {
									product_SKU: success.product_SKU,
									price: success.price,
									count: product.count
								};
								resolve(p);
							} else {
								response.json({status:"does_not_exist"});
							}
					}).catch(ex => {
							response.statusCode = 400;
							response.status = 400;
							response.json(ex);
							reject();
					})
				});

				promises.pushObject(promise);
			}


			//Resolve all promises then update cart
			Promise.all(promises).then(_products => {
				let total_price = 0;
			  for(let _p of _products) {
					total_price += _p.price*_p.count;
				}
				sails.models.cart.findOne({user_id: request.body.user_id}).then(success => {
					if(success) {	//UPDATE EXISTING
						console.log("Found Cart: ", success);
						let new_price = total_price += success.total;
						let old_products = success.products;
						let new_products = old_products.concat(_products);
						let value = {
							products: new_products,
							price: new_price
						};
						sails.models.cart.update({user_id: request.body.user_id}, value).then(success => {
								console.log("Logging success: ", success);
								response.json(success);
						}).catch(ex => {
								response.statusCode = 400;
								response.status = 400;
								response.json(ex);
						})
					} else { //CREATE NEW CART
						let cart = {
							user_id: request.body.user_id,
							products: _products,
							price: total_price
						};

						sails.models.cart.create(cart).then(success => {
								console.log("Logging success: ", success);
								response.json(success);
						}).catch(ex => {
								response.statusCode = 400;
								response.status = 400;
								response.json(ex);
						})
					}
				}).catch(ex => {
						response.statusCode = 400;
						response.status = 400;
						response.json(ex);
				})
			});
	},

	getCart: (request, response) => {

		console.log("Received POST for GET CART");
		console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");


		if (request.query.user_id) {
			let options = {
				user_id: request.query.user_id
			};

			sails.models.cart.findOne(options).then(success => {
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


	}


	deleteCart: (request, response) => {
			console.log("Received POST for DELETE CART");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");
			if (request.query.user_id) {
				let options = {
					user_id: request.query.user_id
				};

				sails.models.cart.destroy(options).then(success => {
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
	}



};
