/**
 * CartController
 *
 * @description :: Server-side logic for managing carts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let toolifier = require('toolifier');
let shortid = require('shortid');
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

			console.log(request.body)

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
										p = productService.processSuit(p, old_product);
									}
									// console.log("no extras");
									// if(_p === "Price Mismatch") {
									// 	response.status(400).json("Prices do not match. BEGONE CRIMINAL SCUM");
									// 	reject();
									// } else {
									// 	p = _p;
									// }
								}
								console.log(p);
								resolve(p);
							} else {
								response.json({status:"does_not_exist"});
							}
					}).catch(ex => {
							response.statusCode = 400;
							response.status = 400;
							response.json(ex);
							reject(ex);
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
				console.log("ok continue")
				sails.models.cart.findOne({user_id: request.body.user_id}).then(success => {
					if(success) {	//UPDATE EXISTING
						// console.log("merging");
						//Merge products & price
						let new_price = total_price += success.total;
						if(new_price < 0) {
							new_price = 0;
						}
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

	merge: (request, response) => {
		console.log("Received POST for MERGE LOCAL CART");
		console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");
		//set up product and calc price
		let products = request.body.products;
		products = products.concat(request.body._products);
		// console.log(products);
		let promises = [];
		// console.log(products.length);
		for (let product of products) {
			let promise = new Promise((resolve, reject) => {
				let old_product = product;
				let options = {
					id: product.id
				};
				sails.models.product.findOne(options).then(success => {
					if(success) {
						let p = {
							product_SKU: success.id,
							id: success.id,
							price: success.price,
							name: success.name,
							description: success.description,
							category: success.category,
							image_urls: success.image_urls,
							count: old_product.count
						};
						if(old_product.category === 'Suit') {
							if(!!old_product.extras && !_.isEmpty(old_product.extras)) {
								p = productService.processSuit(p, old_product);
							}
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
			let merged_products = mergeProducts(_products, []);
			let total_price = 0;
			for(let _p of merged_products) {
				total_price += _p.price*_p.count;
			}
			let cart = {
				user_id: shortid.generate(),
				products: merged_products,
				total: total_price
			}
			response.status(200).json(cart);
		});
		
		
	},





};

//Merge all multiple instances
function mergeProducts (products1, products2) {

	let new_products = products1.concat(products2);
	if(new_products.length <= 1) {
		return new_products;
	}
	let final_products = [];
	let sortedArr = toolifier.objects.sortByKey(new_products, 'product_SKU');
	// console.log(sortedArr.length);
	let current = sortedArr[0];
	let currentIndex = 0;
	let i = 0;
	//Iterate through array
	while(currentIndex <= sortedArr.length-1){
		if(i >= sortedArr.length-1) {
			currentIndex++;
			// console.log("ITERATING" + currentIndex + " " + i);
			final_products.push(current);
			current = sortedArr[currentIndex];
			i = currentIndex;
		} else {
			i++;
			// console.log("COMPARING" + currentIndex + " " + i);
			if (sortedArr[i].product_SKU != current.product_SKU) { //Check if SKUs do not match, if they don't then ignore
				i = sortedArr.length;
			} else { //SKUs do match, but do objects match?
				//Temporarily store the count, because this prop should be ignored for the equivalence
				const tempcount = sortedArr[i].count;
				sortedArr[i].count = current.count;
				//Check if objects are equivalent
				let flag = __.isEquivalent(sortedArr[i], current)
				sortedArr[i].count = tempcount;
	
				if(!flag) {
					//Products are too dissimilar, ignore
				} else {
					current.count += sortedArr[i].count;
					sortedArr[i].count = 0;
					// console.log("changing counts");
				}
			}
		}

	}

	let final = [];
	for(let product of final_products) {
		if(product.count > 0) {
			final.push(product);
		}
	}
	// console.log(final);

	return final.reverse();
}
