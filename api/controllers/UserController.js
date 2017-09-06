/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	trigger: (request, response) => {

	    let create_object = {
            fullname: "Carl Eiserman",
            email: "me@myemailaddress.com",
            password: "123456",
            contact_mobile: "0711234567",
            carts: [],
            orders: []
        };

        console.log("Received POST for CREATE USER");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        sails.models.user.create(create_object).then(success => {
            console.log("Logging success: ", success);
            response.json(success);
        }).catch(ex => {
            response.statusCode = 400;
            response.status = 400;
            response.json(ex);
        })
    },

    createUser: (request, response) => {
        console.log("Received POST for CREATE USER");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        sails.models.user.create(request.body).then(success => {
            console.log("Logging success: ", success);
            response.json(success);
        }).catch(ex => {
            response.statusCode = 400;
            response.status = 400;
            response.json(ex);
        })
    },

		updateUser: (request, response) => {
        console.log("Received POST for UPDATE USER");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

				// console.log(request.body)
				//TODO get the request token & match that token vs the user id requested unless admin permissions

        sails.models.user.update({user_id: request.body.user_id}, request.body).then(success => {
            console.log("Logging success: ", success);
            response.json(success);
        }).catch(ex => {
            response.statusCode = 400;
            response.status = 400;
            response.json(ex);
        })
    },

		getUser: (request, response) => {

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
