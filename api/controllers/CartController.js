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

			sails.models.cart.update({user_id: request.body.user_id}, request.body).then(success => {
					console.log("Logging success: ", success);
					response.json(success);
			}).catch(ex => {
					response.statusCode = 400;
					response.status = 400;
					response.json(ex);
			})
	},

	getCart: (request, response) => {

		console.log("Received POST for GET USER");
		console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");


		if (request.query.user_id) {
			let options = {
				user_id: request.query.user_id
			};

			sails.models.user.findOne(options).then(success => {
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
