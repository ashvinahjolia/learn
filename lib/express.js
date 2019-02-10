'use strict';

/**
 * Module dependencies.
 */
const express = require('express'),
  bodyParser = require('body-parser'),
  cookieParser = require('cookie-parser'),
  path = require('path'),
  compression = require('compression'),
  fs = require('fs'),
  morgan = require('morgan'),
  Boom = require('../languages/en/errors'),
  { processError } = require('../common/helper');

const userRoute = require(path.resolve('modules/user/routes/user')),
  migrationRoute = require(path.resolve('migrations/index'));


const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

/**
 * Initialize global variables
 */
module.exports.initGlobalVariables = function () {
  // Setting application local variables
  global.rootPath = path.dirname(process.mainModule.filename);

};

/**
 * Initialize access log
 */
module.exports.initAccessLog = function (app) {
  app.use(morgan('common', {
    stream: fs.createWriteStream(path.join(__dirname, '../logs/access.log'), { flags: 'a' })
  }));
};

/**
 * Initialize application middleware
 */
module.exports.initMiddleware = function (app) {
  app.set('view engine', 'ejs');
  app.use(compression());
  app.use(bodyParser.urlencoded({ limit: '5mb', extended: false }));
  app.use(bodyParser.json());
  app.use(cookieParser());
  app.use(this.allowCrossDomain);
  app.disable('x-powered-by');

};

/**
 * Allowing X-domain request
 */
module.exports.allowCrossDomain = function (req, res, next) {
  // CORS headers
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Cache-Control, x-access-token, Pragma, Origin, Content-Type, X-Requested-With, content-type");
  res.header("Access-Control-Allow-Methods", "GET, PUT, POST");
  return next();
};

/**
 * Configure the modules static routes
 */
module.exports.initModulesClientRoutes = function (app) {
  // Setting the app router and static folder
  app.set('views', path.join(__dirname, '../public'));
  app.use('/', express.static(path.resolve('./public')));
};

/**
 * Configure the modules server routes
 */
module.exports.initServerRoutes = function (app) {
  // Globbing routing files
  app.use('/migration', migrationRoute);
  app.use('/api/users', userRoute);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


  app.get('/', function(req, res) {
    res.render('index');
  });

  // All undefined URL will call this function
  app.all('/*', function (req, res) {
    return processError(res, Boom.METHOD_NOT_IMPLEMENTED);
    //res.sendFile(path.join(__dirname, '../public/dist/index.html'));
  });

};

/**
 * Configure error handling
 */
module.exports.logError = function (app) {
  app.use(function (err, req, res, next) {
    next(err);
  });
};

/**
 * Configure error handling
 */
module.exports.initError = function (app) {
  // development error handler
  // will print stacktrace
  if (process.env.NODE_ENV === 'development') {
    app.use(function (err, req, res, next) {
      return processError(res, {
        status: 0,
        statusCode: 500,
        name: "SomethingWrong",
        message: err.stack
      });
    });
  } else {
    app.use(function (err, req, res, next) {
      return processError(res, {
        status: 0,
        statusCode: 500,
        name: "SomethingWrong",
        message: 'Something went wrong'
      });
    });
  }
};

/**
 * Initialize the Express application
 */
module.exports.init = function () {

  // Initialize express app
  let app = express();

  // Initialize local variables
  this.initGlobalVariables();

  this.initAccessLog(app);

  // Initialize Express middleware
  this.initMiddleware(app);

  // Initialize modules static client routes, before session!
  this.initModulesClientRoutes(app);

  // Initialize modules server routes
  this.initServerRoutes(app);

  // Initialize error routes
  this.logError(app);

  // Initialize error routes
  this.initError(app);

  return app;
};
