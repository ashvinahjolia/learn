'use strict';

const path = require('path'),
  config = require(path.resolve('config/config')),
  jwt = require('jsonwebtoken'),
  { processError } = require(path.resolve('common/helper')),
  Boom = require(path.resolve('languages/en/errors'));

let getCaller = (req, res, next) => {
  let token = getToken(req);
  if (!token) {
    req.caller = null;
    next();
  } else {
    let caller = getCallerByToken(token);
    req.caller = caller;
    next();
  }
};

let getToken = (req) => {
  if (!req || !req.headers || !req.headers.authorization) {
    return null;
  }
  return req.headers.authorization;
};

let getCallerByToken = (authzHdr) => {
  try {
    let decoded = jwt.verify(authzHdr, config.key.privateKey);
    return decoded;
  } catch (error) {
    return null;
  }
};

let checkAuth = (req) => {
  let token = getToken(req);
  if (!token) {
    return null;
  }
  let caller = getCallerByToken(token);
  if (!caller) {
    return null;
  }
  return caller;
};

let IsAdmin = function (req, res, next) {
  let caller = checkAuth(req);
  if (!caller) {
    return processError(res, Boom.LOGIN_REQUIRED);
  }
  if (caller.role !== 1) {
    return processError(res, Boom.LOGIN_REQUIRED);
  }
  req.caller = caller;
  next();
};

let IsUser = function (req, res, next) {
  let caller = checkAuth(req);
  if (!caller) {
    return processError(res, Boom.LOGIN_REQUIRED);
  }
  if (caller.role !== 2) {
    return processError(res, Boom.LOGIN_REQUIRED);
  }
  req.caller = caller;
  next();
};

let IsAdminUser = function (req, res, next) {
  let caller = checkAuth(req);
  if (!caller) {
    return processError(res, Boom.LOGIN_REQUIRED);
  }
  if (caller.role !== 1 && caller.role !== 2) {
    return processError(res, Boom.LOGIN_REQUIRED);
  }
  req.caller = caller;
  next();
};

let IsLogin = function (req, res, next) {
  let caller = checkAuth(req);
  if (!caller) {
    return processError(res, Boom.LOGIN_REQUIRED);
  }
  if (caller.role !== 1 && caller.role !== 2) {
    return processError(res, Boom.LOGIN_REQUIRED);
  }
  req.caller = caller;
  next();
};

module.exports = {
  getCaller,
  IsAdmin,
  IsUser,
  IsAdminUser,
  IsLogin
};