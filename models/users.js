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
    first_name: {
      type: DataTypes.STRING,
    },
    last_name: {
      type: DataTypes.STRING,
    }
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