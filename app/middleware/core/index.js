const express = require('express');
const cors = require('cors');

const fastestValidatorService = require('../../services/fastest-validator');

function notify(req, res, next) {
  req.notify = (title, message, status = 'success') => {
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
  req.validate = schema => fastestValidatorService.validate(schema, req.body);

  next()
}

function exec(app) {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(notify, validate)
}

module.exports = exec