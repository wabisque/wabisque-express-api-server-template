'use strict';

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('roles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      allowNull: false,
      type: Sequelize.STRING(100),
      unique: true
    },
    description: {
      allowNull: true,
      type: Sequelize.STRING
    },
    created_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
    updated_at: {
      allowNull: false,
      type: Sequelize.DATE
    },
    deleted_at: {
      allowNull: true,
      type: Sequelize.DATE
    }
  });
}

async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('roles');
}

module.exports = {
  up,
  down
};