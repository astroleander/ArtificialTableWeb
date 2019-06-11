'use strict'
const merge = require('webpack-merge')
const prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  // BASE_API: '"http://119.29.63.216:8000/api/v1"'
  BASE_API: '"http://123.207.164.113:8000/api/v1"'
   // BASE_API: '"http://localhost:8000/api/v1"'
});
