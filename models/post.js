"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class post extends Model {
    static associate(models) {
      post.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      post.hasMany(models.Post_Images, {
        foreignKey: "postId",
        as: "images",
        onDelete: "CASCADE",
      });

      post.hasMany(models.Comment, {
        foreignKey: "postId",
        as: "comments",
        onDelete: "CASCADE",
      });

      post.belongsToMany(models.Tag, {
        through: "PostTag",
        foreignKey: "postId",
        otherKey: "tagId",
        as: "tags",
      });
    }
  }

  post.init(
    {
      description: {
        type: DataTypes.STRING(300),
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Post",
    },
  );

  return post;
};
