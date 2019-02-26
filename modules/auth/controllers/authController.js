'use strict';

/**
 * Module dependencies
 */
const _ = require('lodash');

/**
 * Extend auth's controller
 */
module.exports = _.extend(
  require('./auth/loginController'),
  require('./auth/registerController')
);