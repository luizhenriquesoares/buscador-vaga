const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const logger = require('morgan');
const errorHandler = require('errorhandler');
const join = require('path').join

module.exports = function (app, passport) {
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));  
  app.use(cors());
  app.use(logger('dev'));
  app.use(express.static(join(__dirname, 'public')));
  app.use(errorHandler());
}