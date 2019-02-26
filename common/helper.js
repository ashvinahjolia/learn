'use strict';

/**
 * Module dependencies
 */
const bcrypt = require('bcrypt-nodejs'),
      fs = require('fs'),
      crypto = require('crypto');


// Constant variables  
const algorithm = 'aes-256-cbc';
const key = '3zTvzr3p67VC61jmV54rIYu1545x4SMp';
const iv = 'ldSgfIosvBfkLdgb';

/* For encrypt decrypt password */
let encrypt = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

// compare password
let validPassword = (myPlaintextPassword, hash) => {
  return bcrypt.compareSync(myPlaintextPassword, hash); // true
};

// Generate random string
let randomString = (length, type = null) => {
  let str = '';
  let chars;
  if (type === 'number') {
    chars = '123456789'.split('');
  } else {
    chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'.split('');
  }
  let charsLen = chars.length;
  if (!length) {
    length = ~~(Math.random() * charsLen);
  }
  for (let i = 0; i < length; i += 1) {
    str += chars[~~(Math.random() * charsLen)];
  }
  return str;
};

let mapError = (errorObject) => {
  if (!errorObject || !errorObject.details) {
    return [];
  }
  let errors = errorObject.details;

  return errors.map((item) => {
    return { field: item.context.label, message: item.message };
  });
};

let processError = (response, error) => {
  if (error.name === "NotFoundError") {
    return reportError(response, 404, error.name, 'entry not found');
  } else if (error.name === "Unauthorized") {
    return reportError(response, 401, error.name, `${error.message}`);
  } else if (error.name === "ParamError") {
    return reportError(response, 400, error.name, `${error.message}`);
  } else if (error.name === "ValidationError") {
    return reportError(response, 400, error.name, mapError(error.message));
  } else if (error.name === "PermissionError") {
    return reportError(response, 403, error.name, `${error.message}`);
  } else if (error.name === "Conflict") {
    return reportError(response, 409, error.name, `${error.message}`);
  } else if (error.name === "MethodNotImplemented") {
    return reportError(response, 501, error.name, `${error.message}`);
  }

  return reportError(response, 500, error.name, `${error.message}`);
};

let reportError = (response, code, errorName, emessage) => {
  return reportResult(response, code, { status: 0, error: errorName, result: emessage });
};

let reportResult = (res, code, body = null) => {
  return res.status(code).json(body);
};

let createPagination = (totalRecord, pageNumber, recordPerPage, data) => {
  let remainingCount = (totalRecord) - (((pageNumber - 1) * recordPerPage) + data.length);
  remainingCount = remainingCount >= 0 ? remainingCount : null;
  let result = {};
  result.total = parseInt(totalRecord, 10);
  result.limit = parseInt(recordPerPage, 10);
  result.page = parseInt(pageNumber, 10);
  result.pages = Math.ceil(totalRecord / recordPerPage);
  result.nextPage = remainingCount ? parseInt(pageNumber, 10) + 1 : null;
  result.remainingCount = remainingCount;
  result.data = data;
  return result;
};

let encryptFile = (text) => {
  let cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('hex');
};

let decryptFile = (text) => {
  try {
    let encryptedText = Buffer.from(text, 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (e) {
    return null;
  }
};

let moveImage = (target, tmpImageName, newImageName) => {
  let tempPath = path.resolve('./public/tmp/' + tmpImageName);
  let targetPath = path.resolve('./public/' + target + '/' + newImageName);

  try {
    fs.rename(tempPath, targetPath, function (err) {
      if (err) {
        console.log(err);
      }
    });
  } catch (e) {
    console.log(e);
  }
};

// Export functions
module.exports = {
  encrypt,
  validPassword,
  randomString,
  processError,
  reportError,
  reportResult,
  createPagination,
  encryptFile,
  decryptFile,
  moveImage
};

