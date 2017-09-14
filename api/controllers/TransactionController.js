/**
 * TransactionController
 *
 * @description :: Server-side logic for managing transactions
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	updateTransaction:  (request, response) => {

			console.log("Received POST for UPDATE PAYMENT");
			console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

			let payment_data = request.body; //update this later
			let id = payment_data.id; //update this later
			//Check for existing payments in DB
			sails.models.transaction.findOne({id: id}).then(success => {
					let order_data = {
						status: payment_data.status.state //This is addPay only
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
	return new Promise((resolve, reject) => {
		sails.models.order.update(order, order_data).then(o => {
				resolve(o);
		}).catch(e => {
				reject(e);
		})
	});
}
