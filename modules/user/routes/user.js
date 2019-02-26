'use strict';

/**
 * Module dependencies
 */
const express = require('express'),
  router = express.Router(),
  { IsLogin } = require('../../../common/auth'),
  { validateBody, schemas } = require('../validate/index');

// User Controller
let user = require('../controllers/userController');

// Get user's list
router.route('/')
  .get(
    IsLogin,
    user.index
  );

// Get User Details
router.route('/:id')
  .get(
    user.userDetails
  );

// Add user
router.route('/')
  .post(
    validateBody(schemas.addUserSchema),
    user.store
  );


// Update user's by id
router.route('/:id')
  .put(
    validateBody(schemas.updateUserSchema),
    user.update
  );

// Delete user's by id
router.route('/:id')
  .delete(
    user.delete
  );

module.exports = router;
