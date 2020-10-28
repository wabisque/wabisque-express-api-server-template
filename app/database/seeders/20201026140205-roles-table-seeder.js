'use strict';

const moment = require('moment');

async function up(queryInterface, Sequelize) {
  const roles = [
    { 
      name: 'Super Admin',
      description: 'A super administrator.',
      created_at: moment().format(),
      updated_at: moment().format()
    },
    { 
      name: 'Admin',
      description: 'A administrator of the app and clients.',
      created_at: moment().format(),
      updated_at: moment().format()
    },
    { 
      name: 'Client',
      description: 'A regular user of the app.',
      created_at: moment().format(),
      updated_at: moment().format()
    }
  ];

  await queryInterface.bulkInsert('roles', roles, {});
}

async function down(queryInterface, Sequelize) {
  await queryInterface.bulkDelete('roles', null, {});
}

module.exports = {
  up,
  down
};
