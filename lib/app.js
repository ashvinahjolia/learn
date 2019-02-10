'use strict';

/**
 * Module dependencies.
 */
const config = require('../config/config'),
  express = require('./express');

module.exports.init = function init(callback) {
  // Initialize express
  let app = express.init();
  if (callback) callback(app, config);

};

module.exports.start = function start(callback) {
  let _this = this;
  _this.init(function (app, config) {
    // Start the app by listening on <port> at <host>
    app.listen(config.port, config.host, function () {
      let server = 'http://' + config.host + ':' + config.port;
      console.log(' ');
      console.log('\x1b[33m', '========================================================', '\x1b[0m');
      console.log('\x1b[36m', config.app.title, '\x1b[0m');
      console.log(' ');
      console.log('\x1b[32m', 'Environment:     ' + process.env.NODE_ENV, '\x1b[0m');
      console.log('\x1b[32m', 'Server:          ' + server, '\x1b[0m');
      console.log('\x1b[32m', 'Time             ' + new Date().toString(), '\x1b[0m');
      console.log('\x1b[33m', '========================================================', '\x1b[0m');
      console.log(' ');
      if (callback) callback(app, config);
    });
  });
};
