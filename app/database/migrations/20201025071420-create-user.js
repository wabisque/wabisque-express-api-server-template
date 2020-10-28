'use strict';

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    first_name: {
      allowNull: false,
      type: Sequelize.STRING(100)
    },
    last_name: {
      allowNull: false,
      type: Sequelize.STRING(100)
    },
    other_names: {
      allowNull: true,
      type: Sequelize.STRING(100)
    },
    email: {
      allowNull: false,
      type: Sequelize.STRING(254),
      unique: true
    },
    username: {
      allowNull: true,
      type: Sequelize.STRING(30),
      unique: true
    },
    phone_number: {
      allowNull: true,
      type: Sequelize.STRING(30),
    },
    hash: {
      allowNull: false,
      type: Sequelize.STRING(100)
    },
    salt: {
      allowNull: false,
      type: Sequelize.STRING(100)
    },
    email_verified_at: {
      allowNull: true,
      type: Sequelize.DATE,
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
  },
  {
    indexes: [
      {
        name: 'identifier',
        fields: [ 'email', 'username' ]
      }
    ]
  });
}

async function down(queryInterface, Sequelize) {
  await queryInterface.dropTable('users');
}

module.exports = {
  up,
  down
};