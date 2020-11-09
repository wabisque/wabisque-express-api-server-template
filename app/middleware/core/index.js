const express = require('express');
const cors = require('cors');

const fastestValidatorService = require('../../services/fastest-validator');

function exec(app) {
  function trim(req, res, next) {
    req.trim = function() {
      for(const field in req.body) {
        if((typeof req.body[field] == 'string' || req.body[field] instanceof String) && !req.body[field]) req.body[field] = null
      }
    }

    next()
  }

  function notify(req, res, next) {
    req.notify = function (title, message, status = 'success') {
      const statusOptions = ['success', 'info', 'warning', 'danger'];
  
      return {
        status: statusOptions.includes(status) ? status : statusOptions[0],
        title: title,
        message: message
      }
    }
  
    next()
  }
  
  function validate(req, res, next) {
    req.validate = function (schema) {
      return fastestValidatorService.validate(schema, req.body)
    }
  
    next()
  }

  const middleware = [
    cors(),
    express.json(),
    express.urlencoded({ extended: true }),
    trim,
    notify,
    validate
  ];

  app.use(...middleware)
}

module.exports = exec