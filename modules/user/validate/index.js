'use strict';

/**
 * Module dependencies
 */
const Joi = require('joi'),
  { processError } = require('../../../common/helper');

module.exports = {
  validateBody: (schema) => {
    return (req, res, next) => {
      let result = Joi.validate(req.body, schema, { abortEarly: false });
      if (result.error) {
        return processError(res, { name: "ValidationError", message: result.error });
      } else {
        if (!req.value) {
          req.value = {};
        }
        if (!req.value.body) {
          req.value.body = {};
        }
        req.value.body = result.value;
        next();
      }
    };
  },

  schemas: {
    addUserSchema: Joi.object().keys({
      email: Joi.string().lowercase().max(250).email().required().trim(),
      first_name: Joi.string().max(24).required().trim(),
      last_name: Joi.string().max(24).required().trim()
    }),
    updateUserSchema: Joi.object().keys({
      first_name: Joi.string().max(24).required().trim(),
      last_name: Joi.string().max(24).required().trim()
    })
  }
};