'use strict';

/**
 * Module dependencies.
 */
const _ = require('lodash'),
  glob = require('glob'),
  path = require('path');

/**
 * Validate NODE_ENV existence
 */
let validateEnvironmentVariable = function () {

  let environmentFiles = glob.sync('./config/env/' + process.env.NODE_ENV + '.js');
  if (!environmentFiles.length) {
    if (process.env.NODE_ENV) {
      console.log('\x1b[31m', '+ Error: No configuration file found for "' + process.env.NODE_ENV + '" environment using development instead', '\x1b[0m');
    } else {
      console.log('\x1b[33m', '+ WARNING: NODE_ENV is not defined! Using default development environment', '\x1b[0m');
    }
    process.env.NODE_ENV = 'development';
  }
  // Reset console color
  console.log();
};

/**
 * Validate Token Secret parameter
 */
var validatePrivateKey = function (config) {

  if (!config.key.privateKey) {
    console.log('\x1b[31m', '+ WARNING: It is strongly recommended that you add privateKey config!', '\x1b[0m');
    console.log('\x1b[31m', '  Please add `key.privateKey: process.env.KEY || \'super amazing key\'` to ', '\x1b[0m');
    console.log('\x1b[31m', '  `config/env/default.js`', '\x1b[0m');
    console.log('\x1b[31m', '  otherwise system will use default privateKey', '\x1b[0m');
    console.log();
    config.key.privateKey = 'nkwu87rmknlksdfbksj';
    return false;
  } else {
    return true;
  }
};



/**
 * Initialize global configuration
 */
var initGlobalConfig = function () {
  // Validate NODE_ENV existence
  validateEnvironmentVariable();

  // Get the default config
  var defaultConfig = require(path.join(process.cwd(), 'config/env/default'));

  // Get the current config
  var environmentConfig = require(path.join(process.cwd(), 'config/env/', process.env.NODE_ENV)) || {};

  // Merge config files
  var config = _.merge(defaultConfig, environmentConfig);

  // Validate session secret
  validatePrivateKey(config);


  return config;
};

/**
 * Set configuration object
 */
module.exports = initGlobalConfig();
