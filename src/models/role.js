"use strict";

module.exports = function (sequelize, DataTypes) {
  var Role = sequelize.define(
    "Role",
    {
      name: { type: DataTypes.STRING, allowNull: false }
    },
    {
      timestamps: true,
      tableName: "roles",
      freezeTableName: true
    }
  );

  Role.associate = function (models) {
    Role.belongsToMany(models.User, {
      as: "users", through: "users_roles", foreignKey: { name: "UserId", primaryKey: false, references: null }, constraints: false
    });
  };
  return Role;
};
