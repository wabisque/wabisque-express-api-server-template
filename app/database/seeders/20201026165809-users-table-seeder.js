'use strict';

const moment = require('moment');

const models = require('../models');

const cryptoService = require('../../services/crypto');

async function up(queryInterface, Sequelize) {
  const { hash, salt } = cryptoService.makeHash('mysecret');
  const users = [
    {
      first_name: 'Super',
      last_name: 'Amin',
      email: 'super@email.com',
      username: 'super-admin',
      phone_number: '0241234567',
      hash,
      salt,
      email_verified_at: moment().format(),
      created_at: moment().format(),
      updated_at: moment().format()
    }
  ];

  await queryInterface.bulkInsert('users', users, {});

  const allRoles = await models.Role.findAll();
  
  const superAdminUser = await models.User.findOne({ where: { username: 'super-admin' } });

  if(!!superAdminUser && !!allRoles) await superAdminUser.setRoles(allRoles);
}

async function down(queryInterface, Sequelize) {
  const superAdminUser = await models.User.findOne({ where: { username: 'super-admin' } });

  await superAdminUser.setRoles([]);
  await queryInterface.bulkDelete('users', null, {});
}

module.exports = {
  up,
  down
};
