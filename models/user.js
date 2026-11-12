"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.Post, {
        foreignKey: "userId",
        as: "Posts",
      });
      User.hasMany(models.Comment, {
        foreignKey: "userId",
        as: "comments",
      });

      User.belongsToMany(models.User, {
        as: "Siguiendo",
        through: "Follows",
        foreignKey: "followerId",
        otherKey: "followedId",
      });

      User.belongsToMany(models.User, {
        as: "Seguidores",
        through: "Follows",
        foreignKey: "followedId",
        otherKey: "followerId",
      });
    }
  }
  User.init(
    {
      nickName: {
        type: DataTypes.STRING,
        field: "nickname",
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: "User",
    },
  );
  return User;
};
