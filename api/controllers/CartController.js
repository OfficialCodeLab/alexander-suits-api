/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let toolifier = require('toolifier');
let _ = require('lodash');

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
					let old_product = product;
					let options = {
						id: product.id
					};
					sails.models.product.findOne(options).then(success => {
							if(success) {
								// console.log("Found product: ", success);
								let p = {
									product_SKU: success.id,
									price: success.price,
									name: success.name,
									description: success.description,
									category: success.category,
									// extras: success.extras,
									image_urls: success.image_urls,
									count: old_product.count
								};
								if(old_product.category === 'Suit') {
									// if (p.price !== old_product.base_price ) { // improve in future, cba now
									// 	response.status(400).json("Base prices do not match. BEGONE CRIMINAL SCUM");
									// 	reject();
									// }
									if(!!old_product.extras && !_.isEmpty(old_product.extras)) {
										console.log(old_product.extras);
										console.log("LOLWUT");
										p = productService.processSuit(p, old_product);
									}
									// if(_p === "Price Mismatch") {
									// 	response.status(400).json("Prices do not match. BEGONE CRIMINAL SCUM");
									// 	reject();
									// } else {
									// 	p = _p;
									// }
								}
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

				promises.push(promise);
			}


			//Resolve all promises then update cart
			Promise.all(promises).then(_products => {
				let total_price = 0;
			  for(let _p of _products) {
					total_price += _p.price*_p.count;
				}
				sails.models.cart.findOne({user_id: request.body.user_id}).then(success => {
					if(success) {	//UPDATE EXISTING

						//Merge products & price
						let new_price = total_price += success.total;
						let final_products = mergeProducts(success.products, _products);

						let value = {
							products: final_products,
							total: new_price
						};
						//Update
						sails.models.cart.update({user_id: request.body.user_id}, value).then(success => {
								console.log("Logging success: ", success[0]);
								response.json(success[0]);
						}).catch(ex => {
								response.statusCode = 400;
								response.status = 400;
								response.json(ex);
						})
					} else { //CREATE NEW CART
						let cart = {
							user_id: request.body.user_id,
							products: _products,
							total: total_price
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

		console.log("Received GET for GET CART");
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


	},


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
							response.json("success");
						} else {
							response.json("does_not_exist");
						}
				}).catch(ex => {
						response.statusCode = 400;
						response.status = 400;
						response.json(ex);
				})
			} else {
					response.statusCode = 400;
					response.status = 400;
					response.json("no_id_provided");
			}
	},





};

//Merge all multiple instances
function mergeProducts (products1, products2) {

	let new_products = products1.concat(products2);
	let final_products = [];
	let sortedArr = toolifier.objects.sortByKey(new_products, 'product_SKU');
	var current = sortedArr[0];
	for (var i = 1; i < sortedArr.length; i++) {
		if (sortedArr[i].product_SKU != current.product_SKU) {
				final_products.push(current);
				current = sortedArr[i];
		} else {
				current.count += sortedArr[i].count;
		}
	}
	final_products.push(current);

	let final = [];
	for(let product of final_products) {
		if(product.count != 0) {
			final.push(product);
		}
	}

	return final.reverse();
}
