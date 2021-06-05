/**
 * HTTP Server Settings
 * (sails.config.http)
 *
 * Configuration for the underlying HTTP server in Sails.
 * (for additional recommended settings, see `config/env/production.js`)
 *
 * For more information on configuration, check out:
 * https://sailsjs.com/config/http
 */

module.exports.http = {

  /****************************************************************************
  *                                                                           *
  * Sails/Express middleware to run for every HTTP request.                   *
  * (Only applies to HTTP requests -- not virtual WebSocket requests.)        *
  *                                                                           *
  * https://sailsjs.com/documentation/concepts/middleware                     *
  *                                                                           *
  ****************************************************************************/

  middleware: {

    /***************************************************************************
    *                                                                          *
    * The order in which middleware should be run for HTTP requests.           *
    * (This Sails app's routes are handled by the "router" middleware below.)  *
    *                                                                          *
    ***************************************************************************/

    order: [
      'cookieParser',
      'session',
      'bodyParser',
      'compress',
      'poweredBy',
      'appRequestLogger',
      'router',
      'www',
      'favicon',
    ],

    appRequestLogger: function (req, res, next) {
      const env = process.env.NODE_ENV || 'development';
      sails.log.debug('<<------------------------------');
      sails.log.debug('Requested data :: ');
      sails.log.debug('  ', req.method, req.url);
      sails.log.debug('   Headers:');
      sails.log.debug(req.headers);
      if (env.toLowerCase() !== 'production') {
        sails.log.debug('   Params:');
        sails.log.debug(req.params);
        sails.log.debug('   Body:');
        sails.log.debug(req.body);
      }
      sails.log.debug('------------------------------>>');
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
      res.header('Allow', 'GET, POST, PUT, DELETE, OPTIONS, HEAD');
      res.header('X-Powered-By', '');

      if (req.method === 'OPTIONS' && req.url.indexOf('graphql') > -1) {
        return res.status(200).send();
      } else {
        return next();
      }
    }


    /***************************************************************************
    *                                                                          *
    * The body parser that will handle incoming multipart HTTP requests.       *
    *                                                                          *
    * https://sailsjs.com/config/http#?customizing-the-body-parser             *
    *                                                                          *
    ***************************************************************************/

    // bodyParser: (function _configureBodyParser(){
    //   var skipper = require('skipper');
    //   var middlewareFn = skipper({ strict: true });
    //   return middlewareFn;
    // })(),

  },

};
