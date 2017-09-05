/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
    createProduct: (request, response) => {
        console.log("Received POST for CREATE Product");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        console.log("Body: ", JSON.stringify(request.body, null, 4));

        sails.models.product.create(request.body).then(success => {
            console.log("Logging success: ", success);
            response.json(success);
        }).catch(ex => {
            response.statusCode = 400;
            response.status = 400;
            console.log(ex);
            response.json(ex);
        })
    },

    getAll: (request, response) => {
        console.log("Received GET for All Products");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        let options = {};
        if (req.params) {
          options = {
            category: req.params.category
          };
        }

        sails.models.product.find(options).then(success => {
            console.log("Logging success: ", success);
            response.json(success);
        }).catch(ex => {
            response.statusCode = 400;
            response.status = 400;
            console.log(ex);
            response.json(ex);
        })
    }
};
