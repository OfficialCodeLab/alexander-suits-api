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
                    _product.image_urls.push('https://res.cloudinary.com/dhb9izfva/image/upload/v1510138880/casual-suit_wplfns.png');
                } else if (category === 'Shirt') {
                    _product.price = getPrice(_product, "shirt");
                    _product.weave_description = _product.weaves_desc_shirt;
                    _product.image_urls.push('https://res.cloudinary.com/dhb9izfva/image/upload/v1510135548/smart-shirt_b0psgm.png');
                } else if (category === 'Trouser') {
                    _product.price = getPrice(_product, "suit") * 0.22;
                    _product.weave_description = _product.weaves_desc_suit;
                    _product.image_urls.push('https://res.cloudinary.com/dhb9izfva/image/upload/v1509287057/Trousers-01_mre2kg.png');
                } else if (category === 'Jacket') {
                    _product.price = getPrice(_product, "suit") * 0.80;
                    _product.weave_description = _product.weaves_desc_suit;
                    _product.image_urls.push('https://res.cloudinary.com/dhb9izfva/image/upload/v1510138880/casual-suit_wplfns.png');
                } else if (category === 'Waistcoat') {
                    _product.price = getPrice(_product, "suit") * 0.18;
                    _product.weave_description = _product.weaves_desc_suit;
                    _product.image_urls.push('https://res.cloudinary.com/dhb9izfva/image/upload/v1510135547/waistcoast_tnotob.png');
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

    getInfo: (request, response) => {
        console.log("Received GET for PRODUCT INFO");
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
                        let p = {
                            product_SKU: success.id,
                            price: success.price,
                            name: success.name,
                            description: success.description,
                            category: success.category,
                            image_urls: success.image_urls,
                            count: old_product.count
                        };
                        if(old_product.category === 'Suit') {
                            if(!!old_product.extras && !_.isEmpty(old_product.extras)) {
                                // console.log(old_product.extras);
                                // console.log("LOLWUT");
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
            response.status(200).json(_products);
        });
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
        let options = request.query;
        let _options = {};
        if(options.collections) {
            // options = {collections: {contains: request.query.collections}};
            _options.collections = options.collections;
            delete options['collections'];
        }

        console.log(options);

        sails.models.product.find(options).then(success => {
            console.log("Logging success: ", success);
            if(!!success) {
                let _products = [];
                if(_options.collections) {
                    for(let p of success) {
                        if(!!p.collections && p.collections.includes(_options.collections)) {
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

    getProduct: (request, response) => {
        
        console.log("Received GET for GET PRODUCT");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        if (request.query) {
                let options = request.query;

                sails.models.product.findOne(options).then(success => {
                        if (success) {
                                console.log("Logging success: ", success);
                                response.json(success);
                        } else {
                                response.json({
                                        status: "does_not_exist"
                                });
                        }
                }).catch(ex => {
                        response.statusCode = 400;
                        response.status = 400;
                        response.json(ex);
                })
        } else {
                response.statusCode = 400;
                response.status = 400;
                response.json({
                        status: "no_id_provided"
                });
        }

    },

    updateProduct: (request, response) => {
        
        console.log("Received POST for UPDATE PRODUCT");
        console.log("PROTOCOL: " + request.protocol + '://' + request.get('host') + request.originalUrl + "\n");

        let product = request.body.product;
        if(product.category === 'Suit') {
            product.image_urls[2] = 'https://res.cloudinary.com/dhb9izfva/image/upload/v1510138880/casual-suit_wplfns.png';
        } else if (product.category === 'Shirt') {
            product.image_urls[2] = 'https://res.cloudinary.com/dhb9izfva/image/upload/v1510135548/smart-shirt_b0psgm.png';
        } else if (product.category === 'Trouser') {
            product.image_urls[2] = 'https://res.cloudinary.com/dhb9izfva/image/upload/v1509287057/Trousers-01_mre2kg.png';
        } else if (product.category === 'Jacket') {
            product.image_urls[2] = 'https://res.cloudinary.com/dhb9izfva/image/upload/v1510138880/casual-suit_wplfns.png';
        } else if (product.category === 'Waistcoat') {
            product.image_urls[2] = 'https://res.cloudinary.com/dhb9izfva/image/upload/v1510135547/waistcoast_tnotob.png';
        } else {
            console.log("Invalid attributes");
            response.status = 400;
            response.json(ex);
        }

       
        sails.models.product.update({product_SKU: request.body.product_SKU}, product).then(success => {
            console.log("Logging success: ", success);
            response.json(success);
        }).catch(ex => {
            response.statusCode = 400;
            response.status = 400;
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