/**
 * LiningController
 *
 * @description :: Server-side logic for managing linings.
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let shortid = require('shortid');

module.exports = {
    
    createLining: (request, response) => {
        console.log("Received POST for CREATE Lining");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");
        console.log("Body: ", JSON.stringify(request.body, null, 4));

        let new_lining = request.body;
        let _lining = JSON.parse(JSON.stringify(new_lining));
        _lining.lining_SKU = shortid.generate();

        sails.models.lining.create(_lining).then(lining => {
            if(!!lining) {
                response.json(lining);
            } else {
                response.statusCode = 400;
                response.status = 400;
                response.json("Unable to create product");
            }
        }).catch(ex => {
            response.statusCode = 400;
            response.status = 400;
            response.json(ex);
        })
    },

    getAll : (request, response) => {
        console.log("Received GET for All Linings");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");
        console.log("From: " + request.headers.origin);

        sails.models.lining.find().then(linings => {
            console.log("Logging success: ", linings);
            if(!!linings) {
                response.status(200).json(linings);
            } else {
                response.status(400).json([]);
            }
        }).catch(ex => {
            response.statusCode = 400;
            response.status = 400;
            console.log(ex);
            response.json(ex);
        });
    },    

    getLining: (request, response) => {        
        console.log("Received GET for GET LINING");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        if (request.query) {
            let options = request.query;

            sails.models.lining.findOne(options).then(lining => {
                if (lining) {
                    console.log("Logging success: ", lining);
                    response.json(lining);
                } else {
                    response.json({
                        status: "does_not_exist"
                    });
                }
            }).catch(ex => {
                response.statusCode = 400;
                response.status = 400;
                response.json(ex);
            });
        } else {
            response.statusCode = 400;
            response.status = 400;
            response.json({
                status: "no_id_provided"
            });
        }

    },

    updateLining: (request, response) => {        
        console.log("Received POST for UPDATE LINING");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");
        console.log("Body: ", JSON.stringify(request.body.lining, null, 4));

        let lining = request.body.lining;

        sails.models.lining.update({lining_SKU: request.body.lining_SKU}, lining).then(lining => {
            console.log("Logging success: ", lining);
            response.json(lining);
        }).catch(ex => {
            response.statusCode = 400;
            response.status = 400;
            response.json(ex);
        })

    },
}