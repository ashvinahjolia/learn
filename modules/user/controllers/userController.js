'use strict';

/**
 * Module dependencies
 */
let _ = require('lodash');

/**
 * Extend user's controller
 */
module.exports = _.extend(
  require('./user/userController')
);