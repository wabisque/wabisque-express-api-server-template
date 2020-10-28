'use strict';

const { Model } = require('sequelize');

function exec(sequelize, DataTypes) {
  class Role extends Model {



    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.User, {
        as: 'users',
        through: models.UserRole,
        foreignKey: 'role_id',
        otherKey: 'user_id'
      })
    }
  };

  Role.init({
    name: DataTypes.STRING(100),
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
    tableName: 'roles',
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });

  return Role;
}

module.exports = exec