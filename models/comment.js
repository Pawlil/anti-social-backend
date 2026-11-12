"use strict";
const { number } = require("joi");
const { Model } = require("sequelize");

const obtenerMesesMaximos = () => {
  const meses = number(process.env.COMMENT_MAX_AGE_MONTHS ?? 3);
  return Number.isInteger(meses) && meses >= 0 ? meses : 3;
};

module.exports = (sequelize, DataTypes) => {
  class comment extends Model {
    static associate(models) {
      comment.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });

      comment.belongsTo(models.Post, {
        foreignKey: {
          name: "postId",
          allowNull: false,
        },
        as: "post",
        onDelete: "CASCADE",
      });
    }
  }

  comment.init(
    {
      content: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      postId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      visible: {
        type: DataTypes.VIRTUAL,
        get() {
          const fechaCreacion = this.getDataValue("createdAt");

          if (!fechaCreacion) {
            return false;
          }

          const mesesConfigurados = Number(
            process.env.COMMENT_MAX_AGE_MONTHS ?? 3,
          );

          const mesesMaximos =
            Number.isInteger(mesesConfigurados) && mesesConfigurados >= 0
              ? mesesConfigurados
              : 3;

          const fechaLimite = new Date();
          fechaLimite.setMonth(fechaLimite.getMonth() - mesesMaximos);

          return new Date(fechaCreacion) >= fechaLimite;
        },
      },
    },
    {
      sequelize,
      modelName: "Comment",
    },
  );

  return comment;
};
