'use strict';
require('babel-core/register')({
  "presets": [
    "es2015",
    "stage-0"
  ]
});
require("babel-polyfill");
const app = require('./app');

module.exports = app;
