'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  _ = require('lodash'),
  Boom = require(path.resolve('languages/en/errors')),
  { reportResult, processError, encrypt } = require(path.resolve('common/helper')),
  { User } = require(path.resolve('lib/db'));

/*
* Devloper Name: Ashvin Ahjolia
* Function purpose :
    => Register for Admin and user
*  @params :: email, password, first_name, last_name, role(1-Admin, 2-User)
*/
exports.register = function (req, res, next) {
  let data = _.pick(req.value.body, ['email', 'password', 'first_name', 'last_name', 'role']);
  data.password = encrypt(data.password);


  return getUser(data)
    .then(createUser)
    .then(() => {
      return reportResult(res, 201, {
        status: 1,
        message: 'Registration Success.',
        result: []
      });
    }).catch(function (err) {
      if (err.message && err.message === 'emailRegistered') {
        return processError(res, Boom.EMAIL_ALREADY_REGISTERED);
      }
      next(err);
    });
    
  function getUser(data) {
    return new Promise(function (resolve, reject) {
      User.findOne({ where: { email: data.email, role: data.role } }).then((user) => {
        if (user) {
          reject(new Error('emailRegistered'));
        } else {
          resolve(data);
        }
      }).catch(e => {
        reject(e);
      });
    });
  }

  function createUser(data) {
    return User.create(data);
  }

}; // End Register
