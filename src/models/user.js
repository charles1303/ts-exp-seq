"use strict";

module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define(
    "User",
    {
      id: { type: DataTypes.INTEGER, primaryKey: true},
      username: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false }
    },
    {
      timestamps: true,
      tableName: "users",
      freezeTableName: true
    }
  );

  User.associate = function (models) {
    User.belongsToMany(models.Role, {
      as: "roles", through: "users_roles"
    });
  };
  return User;
};
