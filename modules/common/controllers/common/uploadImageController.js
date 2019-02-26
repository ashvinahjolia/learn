'use strict';

/**
 * Module dependencies
 */
const path = require('path'),
  Boom = require(path.resolve('languages/en/errors')),
  fs = require('fs'),
  { processError, randomString, encryptFile } = require(path.resolve('common/helper')),
  formidable = require('formidable');

/**
 * Upload image
 */
exports.uploadImage = function (req, res, next) {

  let maxFilesize = 1024 * 5; // 5 MB

  let form = new formidable.IncomingForm();
  //form.uploadDir = '/tmp';
  form.multiples = false;
  form.keepExtensions = true;
  let properfields = {};

  form.on('field', function (name, value) {
    if (!properfields[name]) {
      properfields[name] = value;
    } else if (properfields[name].constructor.toString().indexOf('Array') > -1) { // is array
      properfields[name].push(value);
    } else { // not array
      let tmp = properfields[name];
      properfields[name] = [];
      properfields[name].push(tmp);
      properfields[name].push(value);
    }
  });

  form.parse(req, function (err, fields, files) {
    if (err) {
      next(err);
    } else {

      let file = files.upload || null;

      if (!file) {
        return processError(res, Boom.IMAGE_NOT_FOUND);
      }

      // Get File extension
      let fileExt = file.type.split('/').pop();

      // Check image type validation
      if (fileExt !== 'jpg' && fileExt !== 'png' && fileExt !== 'jpeg') {
        fs.unlink(file.path);
        return processError(res, Boom.INVALID_IMAGE_TYPE);
      }

      // Get file size in kb
      let fileSize = file.size / 1000;

      // Check image size validation
      if (fileSize > maxFilesize) {
        fs.unlink(file.path);
        return processError(res, Boom.INVALID_IMAGE_SIZE);
      }

      let filename = randomString(16) + '.' + fileExt;
      let tempPath = file.path;
      let targetPath = path.resolve('./public/tmp/' + filename);

      // Create token
      let token = encryptFile(filename);

      fs.rename(tempPath, targetPath, function (err) {
        if (err) {
          next(err);
        } else {
          res.json({ status: 1, message: 'Upload successfully', result: { 'token': token, image: file.name } });
        }
      });
    }
  });
}; // End uploadImage
