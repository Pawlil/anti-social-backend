"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class post_Images extends Model {
    static associate(models) {
      post_Images.belongsTo(models.Post, {
        foreignKey: {
          name: "postId",
          allowNull: false,
        },
        as: "post",
        onDelete: "CASCADE",
      });
    }
  }

  post_Images.init(
    {
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "Post_Images",
    },
  );

  return post_Images;
};
