'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  _ = require('lodash'),
  config = require(path.resolve('config/config')),
  jwt = require('jsonwebtoken'),
  Boom = require(path.resolve('languages/en/errors')),
  { processError, reportResult, validPassword } = require(path.resolve('common/helper')),
  { User } = require(path.resolve('lib/db'));

/*
* Devloper Name: Ashvin Ahjolia
* Function purpose :
    => Login Admin, Artist and Customer
*  @params :: email, password, role
*/
exports.login = function (req, res, next) {
  const data = _.pick(req.value.body, ['email', 'password', 'role']);

  getUser(data)
    .then(checkPassword)
    .then(generateToken)
    .then(function (user) {
      return reportResult(res, 200, { status: 1, message: 'Success', result: user });
    })
    .catch(function (err) {
      next(err);
    });

  function getUser(data) {
    return new Promise(function (resolve) {
      User.findOne({ where: { email: data.email, role: data.role } })
        .then(user => {
          if (!user) {
            return processError(res, Boom.INVALID_EMAIL);
          }
          resolve(user);
        });
    });
  }

  function checkPassword(user) {
    return new Promise(function (resolve) {
      let isMatch = validPassword(data.password, user.password);
      if (!isMatch) {
        return processError(res, Boom.INVALID_PASSWORD);
      } else {
        resolve(user);
      }
    });
  }

  function generateToken(user) {

    return new Promise((resolve) => {
      let data = {};
      data.id = user.id;
      data.role = parseInt(user.role, 10);

      let token = jwt.sign(data, config.key.privateKey, { expiresIn: config.key.tokenExpiry });

      delete data.id;
      data.first_name = user.first_name || '';
      data.last_name = user.last_name || '';
      data.token = token;
      resolve(data);
    });
  }
}; // End login
