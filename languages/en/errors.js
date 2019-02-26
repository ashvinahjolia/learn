'use strict';

/**
 * Module dependencies
 */
var _ = require('lodash');

/**
 * Extend errors files
 */
module.exports = _.extend(
  require('./errors/common'),
  require('./errors/auth')
);