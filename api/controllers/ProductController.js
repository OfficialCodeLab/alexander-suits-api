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

        //for each product category:
        //-- create product:
        //-- if suit:
        //---- use suit specific data(extracted suit price category, weave other, etc)
        //---- use shirt specific data(extracted shirt price category, weave shirt, etc)
        //-- generate product sku with shortid
        //-- append image sketch for each product type (Suit, Shirt, Trousers, etc)
        // CREATE PROMISE ARRAY
        // response 200 if success

        // sails.models.product.create(request.body).then(success => {
        //     console.log("Logging success: ", success);
        //     response.json(success);
        // }).catch(ex => {
        //     response.statusCode = 400;
        //     response.status = 400;
        //     console.log(ex);
        //     response.json(ex);
        // })
    },

    getAll: (request, response) => {
        console.log("Received GET for All Products");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");
  			console.log("From: " + request.headers.origin);

        // let options = {};
        // if (request.params) {
        //   options = {
        //     category: request.params.category
        //   };
        // }

        sails.models.product.find().then(success => {
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

function extractPrice(object) {
    //{ id: "1", name: "Category 1 - R7,500.00" }
    console.log(object.name);
    let split = object.name.split(' - ');
    let value = split[1].substring(1, split[1].length-3);
    console.log(parseFloat(value.replace(/,/g, '')));
}
