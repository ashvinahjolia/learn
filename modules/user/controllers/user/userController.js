'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Boom = require(path.resolve('languages/en/errors')),
  _ = require('lodash'),
  { processError, reportResult } = require(path.resolve('common/helper')),
  { User } = require(path.resolve('lib/db'));

/*
* Devloper Name: Ashvin Ahjolia
* Function purpose :
    => Get all users list
*  @params ::
*/
exports.index = function (req, res, next) {
  
  getUsers()
    .then((user) => {
      return reportResult(res, 200, { status: 1, message: 'Success', result: user });
    })
    .catch((err) => {
      next(err);
    });

  function getUsers() {

    return new Promise(function (resolve, reject) {
      User.findAll(
        {
          attributes: [
            'id',
            'email',
            'first_name',
            'last_name'
          ]
        }
      )
        .then(user => {
          resolve(user);
        }).catch(reject);
    });
  }

}; // End index

/*
* Devloper Name: Ashvin Ahjolia
* Function purpose :
    => Get user details by id
*  @params ::
*/
exports.userDetails = function (req, res, next) {
  let user_id = req.params.id;
  getUsers()
    .then((user) => {
      return reportResult(res, 200, { status: 1, message: 'Success', result: user });
    })
    .catch((err) => {
      next(err);
    });

  function getUsers() {

    return new Promise(function (resolve, reject) {
      User.findById(user_id)
        .then(user => {
          resolve(user);
        }).catch(reject);
    });
  }

}; // End userDetails

/*
* Devloper Name: Ashvin Ahjolia
* Function purpose :
    => Add new user
*  @params :: email, first_name, last_name
*/
exports.store = function (req, res, next) {
  let data = _.pick(req.value.body, ['email', 'first_name', 'last_name']);
 
  return getUser()
    .then(createUser)
    .then( result => {
      return reportResult(res, 201, {
        status: 1,
        message: 'User Added successfully.',
        result: result
      });
    }).catch(function (err) {
      if (err.message && err.message === 'emailRegistered') {
        return processError(res, Boom.EMAIL_ALREADY_REGISTERED);
      }
      next(err);
    });

    function getUser() {
      return new Promise( (resolve, reject) => {
        User.findOne({ where: { email: data.email } }).then((user) => {
          if (user) {
            reject(new Error('emailRegistered'));
          } else {
            resolve(data);
          }
        }).catch(reject);
      });
    }

    function createUser(data) {
      return User.create(data);
    }
}; // End store

/*
* Devloper Name: Ashvin Ahjolia
* Function purpose :
    => Update user's basic info
*  @params :: first_name, last_name
*/
exports.update = function (req, res, next) {

  let data = _.pick(req.value.body, ["first_name", "last_name"]);
  let user_id = req.params.id;
  
    updateBasic()
    .then(function (result) {
      return reportResult(res, 200,
        {
          status: 1,
          message: 'Success',
          result: {
            first_name: data.first_name,
            last_name: data.last_name
          }
        });
    })
    .catch(next);

  // Update basic info  
  function updateBasic() {
    return User.update(data, { where: { id: user_id } });
  }
}; // End update

/*
* Devloper Name: Ashvin Ahjolia
* Function purpose :
    => delete user's by id
*  @params :: 
*/
exports.delete = function (req, res, next) {

  let user_id = req.params.id;
  
    deleteUser()
    .then(function (result) {
      return reportResult(res, 200,
        {
          status: 1,
          message: 'Success',
          result: []
        });
    })
    .catch(next);

  // Delete basic info  
  function deleteUser() {
    return User.destroy({ where: { id: user_id } });
  }
}; // End delete

