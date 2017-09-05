
/**
 * isAuthenticated
 *
 */
var jwt = require('express-jwt');
var rek = require('rekuire');
let secrets = rek('secrets/secrets.js');
const jwksRsa = require('jwks-rsa');

var authCheck = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: secrets.auth_keys.client_url_well_known,
    handleSigningKeyError: (err, cb) => {
      if (err instanceof jwksRsa.SigningKeyNotFoundError) {
        return cb(new Error('This is bad'));
      }

      return cb(err);
    }
  }),
  audience: secrets.auth_keys.client_audience,
  issuer: secrets.auth_keys.client_url,
  algorithms: ['RS256']
});

module.exports = authCheck;
