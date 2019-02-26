'use strict';

/**
 * Module dependencies
 */
const SequelizeSlugify = require('sequelize-slugify');

module.exports = (sequelize, DataTypes) => {
  let User = sequelize.define('users', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    slug: {
      type: DataTypes.STRING,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    },
    role: {
      type: DataTypes.ENUM,
      values: ['1', '2', '3'],
      comment: '1-Admin, 2-Artist, 3-User',
      allowNull: false,
    },
  }, {
      underscored: true,
      timestamps: true
    });

  SequelizeSlugify.slugifyModel(User, {
    source: ['first_name', 'last_name'],
    slugOptions: { lower: true },
    overwrite: false,
    column: 'slug'
  });

  return User;

};