'use strict';

/**
 * Module dependencies
 */
const express = require('express'),
  router = express.Router(),
  { validateBody, schemas } = require('../validate/index')

// Auth Controller
const auth = require('../controllers/authController');

// Login
router.route('/login')
  .post(
    validateBody(schemas.loginSchema),
    auth.login
  );

// Register
router.route('/register')
  .post(
    validateBody(schemas.registerSchema),
    auth.register
  );

module.exports = router;
