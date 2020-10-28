'use strict';
const { Model } = require('sequelize');

function exec(sequelize, DataTypes) {
  class User extends Model {
    getSafeData() {
      const values = this.toJSON();
      delete values.hash;
      delete values.salt;

      return values
    }

    async getSafeDataForFrontend() {
      const values = this.getSafeData();
      
      values.roles = await this.getRoles();
      values.roles = values.roles.map(function(role) {
        const safeRole = role.toJSON();
        delete safeRole.UserRole;

        return safeRole
      });

      return values
    }

    async revokeAllAccessTokens() {
      const accessTokens = await this.getAccessTokens();
      accessTokens.map(async function (accessToken) { await accessToken.revoke() })
    }

    async revokeAllRefreshTokens() {
      const refreshTokens = await this.getRefreshTokens();
      refreshTokens.map(async function (refreshToken) { await refreshToken.revoke() })
    }

    async hasAnyRoles(roles) {
      if(Array.isArray(roles)) {
        if(roles.length == 0) return await this.hasRole(roles);

        for(const role of roles) {
          if(await this.hasRole(role)) return true
        }
      } 
      else return !roles || await this.hasRole(roles);

      return false
    }


    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.belongsToMany(models.Role, {
        as: 'roles',
        through: models.UserRole,
        foreignKey: 'user_id',
        otherKey: 'role_id'
      });

      this.hasMany(models.AccessToken, {
        as: 'accessTokens',
        foreignKey: 'user_id'
      });

      this.hasMany(models.RefreshToken, {
        as: 'refreshTokens',
        foreignKey: 'user_id'
      })
    }
  };

  User.init({
    first_name: DataTypes.STRING(100),
    last_name: DataTypes.STRING(100),
    other_names: DataTypes.STRING(100),
    email: DataTypes.STRING(254),
    username: DataTypes.STRING(30),
    phone_number: DataTypes.STRING(30),
    hash: DataTypes.STRING(100),
    salt: DataTypes.STRING(100),
    email_verified_at: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    paranoid: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at'
  });
  
  return User;
};

module.exports = exec