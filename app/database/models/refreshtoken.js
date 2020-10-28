'use strict';

const { Model } = require('sequelize');
const moment = require('moment');

function exec(sequelize, DataTypes) {
  class RefreshToken extends Model {
    async revoke() {
      if(!this.revoked_at) {
        this.revoked_at = moment().format();
        await this.save()
      }
    }


    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsTo(models.User, {
        as: 'user',
        foreignKey: 'user_id'
      })
    }
  };
  
  RefreshToken.init({
    user_id: DataTypes.INTEGER,
    revoked_at: DataTypes.DATE,
    expires_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'RefreshToken',
    tableName: 'refresh_tokens',
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  
  return RefreshToken;
}

module.exports = exec