'use strict';

/**
 * Module dependencies
 */
const express = require('express'),
  router = express.Router();

// Common Controller
let common = require('../controllers/commonController');

// Upload Image
router.route('/upload/image')
  .post(
    common.uploadImage
  );

module.exports = router;