'use strict';

async function up(queryInterface, Sequelize) {
  await queryInterface.createTable('users_roles', {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'users',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    },
    role_id: {
      allowNull: false,
      type: Sequelize.INTEGER,
      references: {
        model: 'roles',
        key: 'id',
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
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
  await queryInterface.dropTable('users_roles');
}

module.exports = {
  up,
  down
};