'use strict';

module.exports = {
  app: {
    title: 'Demo',
    description: '',
    version: 1.0
  },
  port: process.env.PORT || process.env.NODE_PORT || 8000,
  host: process.env.HOST || 'localhost',
  key: {
    privateKey: '37LvDSm4XvjYOh9YaSdaljS',
    tokenExpiry: 86400 * 1 // 1 Day
  }
};
