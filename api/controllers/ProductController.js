/**
 * ProductController
 *
 * @description :: Server-side logic for managing products
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 let shortid = require('shortid');

module.exports = {
    createProduct: (request, response) => {
        console.log("Received POST for CREATE Product");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        console.log("Body: ", JSON.stringify(request.body, null, 4));

        let new_product = request.body;

        let promisesArr = [];
        for (let category of new_product.categories) {
            let _promise = new Promise((resolve, reject) => {
                let _product = JSON.parse(JSON.stringify(new_product));
                _product.product_SKU = shortid.generate();
                _product.category = category;
                if(category === 'Suit') {
                    _product.price = getPrice(_product, "suit");
                    _product.weave_description = _product.weaves_desc_suit;
                    _product.image_urls.push('image here');
                } else if (category === 'Shirt') {
                    _product.price = getPrice(_product, "shirt");
                    _product.weave_description = _product.weaves_desc_shirt;
                    _product.image_urls.push('image here');
                } else if (category === 'Trouser') {
                    _product.price = getPrice(_product, "suit") * 0.22;
                    _product.weave_description = _product.weaves_desc_suit;
                    _product.image_urls.push('image here');
                } else if (category === 'Jacket') {
                    _product.price = getPrice(_product, "suit") * 0.80;
                    _product.weave_description = _product.weaves_desc_suit;
                    _product.image_urls.push('image here');
                } else if (category === 'Waistcoat') {
                    _product.price = getPrice(_product, "suit") * 0.18;
                    _product.weave_description = _product.weaves_desc_suit;
                    _product.image_urls.push('image here');
                } else {
                    console.log("Invalid attributes");
                    reject("Invalid attributes");
                }
                //Delete extra properties
                delete _product['weaves_desc_suit'];
                delete _product['weaves_desc_shirt'];
                delete _product['categories'];
                delete _product['price_category_shirts'];
                delete _product['price_category_suits'];

                //Create product
                sails.models.product.create(_product).then(product => {
                    if(!!product) {
                        resolve(product);
                    } else {
                        reject("Unable to create product");
                    }
                }).catch(ex => {
                    reject(ex);
                })
                // console.log(_product);
                // resolve(_product);
            });
            promisesArr.push(_promise);
        }

        Promise.all(promisesArr).then(products => {
           response.status(200).json(products);
        }).catch(ex => {
           console.log(ex)
           response.status(400).json(ex);
        })
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

        console.log(request.query);
        let options = {};
        if(request.query.collections) {
            // options = {collections: {contains: request.query.collections}};
        } else {
            options = request.query;
        }
        console.log(options);

        sails.models.product.find(options).then(success => {
            console.log("Logging success: ", success);
            if(!!success) {
                let _products = [];
                if(request.query.collections) {
                    for(let p of success) {
                        if(!!p.collections && p.collections.includes(request.query.collections)) {
                            _products.push(p);
                        }
                    }
                    response.status(200).json(_products);  
                } else {
                    response.status(200).json(success);  
                }              
            } else {
                response.status(400).json([]);
            }
        }).catch(ex => {
            response.statusCode = 400;
            response.status = 400;
            console.log(ex);
            response.json(ex);
        })
    },

    
};

function extractPrice(object) {
    //{ id: "1", name: "Category 1 - R7,500.00" }
    let split = object.name.split(' - ');
    let value = split[1].substring(1, split[1].length-3);
    return parseFloat(value.replace(/,/g, ''));
}

function getPrice(object, type) {
    if(type === "suit") {
        if(object.price) {
            return object.price;
        } else {
            return extractPrice(object.price_category_suits);
        }
    } else {
        if(object.price) {
            return object.price;
        } else {
            return extractPrice(object.price_category_shirts);
        }
    }
}