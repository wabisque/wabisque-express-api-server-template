const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router
  .route('/login')
  .post(...authController.login());

router
  .route('/logout')
  .get(...authController.logout());

router
  .route('/register')
  .post(...authController.register());

router
  .route('/user')
  .get(...authController.user());

router
  .route('/refresh')
  .post(...authController.refresh());

module.exports = router