'use strict';

/**
 * Module dependencies
 */

const express = require('express'),
  router = express.Router(),
  path = require('path'),
  { sequelize, User } = require(path.resolve('lib/db'));

// Drop and create table
router.route('/reset')
  .post(
    reset
  );

module.exports = router;

function reset(req, res, next) {

  sequelize.sync({ force: true })
    .then(user)
    .then(() => {
      console.log('\x1b[32m', '================= Database Migration Completed =================', '\x1b[0m');
      res.send('ok');
    }).catch((e) => {
      console.log(e);
      next(e);
    });
}

function user() {
  return User.bulkCreate([
    {
      slug: 'admin-demo',
      email: 'admin@demo.com',
      first_name: 'admin',
      last_name: 'demo'
    }
  ]);
}

