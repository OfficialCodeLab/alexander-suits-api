/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#!/documentation/concepts/Routes/RouteTargetSyntax.html
 */

module.exports.routes = {

    /***************************************************************************
     *                                                                          *
     * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
     * etc. depending on your default view engine) your home page.              *
     *                                                                          *
     * (Alternatively, remove this and add an `index.html` file in your         *
     * `assets` directory)                                                      *
     *                                                                          *
     ***************************************************************************/

    '/': {
        view: 'homepage'
    },
    //USER
    'get /api/users/create_force' : 'UserController.trigger', // This is a test route
    'get /api/user' : 'UserController.getUser',
    'get /api/user/all' : 'UserController.getAll',
    'post /api/users/create' : 'UserController.createUser',
    'post /api/users/update' : 'UserController.updateUser',

    //PRODUCTS
    'post /api/products/create' : 'ProductController.createProduct',
    'get /api/products/all' : 'ProductController.getAll',
    'post /api/products/get_info' : 'ProductController.getInfo',
    'get /api/product' : 'ProductController.getProduct',
    'post /api/products/update' : 'ProductController.updateProduct',
    
    //PRODUCTS
    'post /api/linings/create' : 'LiningController.createLining',
    'get /api/linings/all' : 'LiningController.getAll',
    'get /api/lining' : 'LiningController.getLining',
    'post /api/linings/update' : 'LiningController.updateLining',
    
    //CART
    'get /api/cart' : 'CartController.getCart',
    'post /api/cart/update' : 'CartController.updateCart',
    'get /api/cart/create' : 'CartController.createCart',
    'delete /api/cart/delete' : 'CartController.deleteCart',
    'post /api/cart/merge' : 'CartController.merge',

    //ORDER
    'get /api/order' : 'OrderController.getOrder',
    'get /api/orders' : 'OrderController.getAllUserOrder',
    'get /api/order/all' : 'OrderController.getAll',
    'post /api/order/create' : 'OrderController.createOrder',
    'post /api/order/update' : 'OrderController.updateOrder',
    'post /api/order/update_status' : 'OrderController.updateStatus',

    //TRANSACTION
    'get /api/transactions/paymentOptions' : 'TransactionController.getPaymentOptions',
    'post /api/transactions/new' : 'TransactionController.createTransaction',
    'post /api/transactions/update' : 'TransactionController.updateTransaction',

    //FUNCTIONS
    'post /api/functions/uploadFile' : 'FunctionsController.uploadFile',
    /***************************************************************************
     *                                                                          *
     * Custom routes here...                                                    *
     *                                                                          *
     * If a request to a URL doesn't match any of the custom routes above, it   *
     * is matched against Sails route blueprints. See `config/blueprints.js`    *
     * for configuration options and examples.                                  *
     *                                                                          *
     ***************************************************************************/

};
