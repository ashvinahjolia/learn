'use strict';

const config = require('../config/config'),
  Sequelize = require('sequelize'),
  UserModel = require('../models/users');

const dbname = config.mysql.dbname;
const username = config.mysql.options.username;
const password = config.mysql.options.password;
const host = config.mysql.host;
const dialect = 'mysql';

const sequelize = new Sequelize(dbname, username, password, {
  host: host,
  dialect: dialect,
  operatorsAliases: false,
  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
  logging: console.log
});

//Models/tables
const User = UserModel(sequelize, Sequelize);

module.exports = {
  User,
  sequelize
};
