"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      customers.hasMany(models.address, {
        foreignKey: "customer_id",
      });

      customers.hasOne(models.cart, {
        foreignKey: "customer_id",
      });

      customers.hasMany(models.order, {
        foreignKey: "customer_id",
      });
    }
  }
  customers.init(
    {
      name: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        isEmail: true,
        unique: true,
      },
      password: {
        type: DataTypes.TEXT,
      },
      phone: {
        type: DataTypes.STRING,
        validate: {
          is: /^[0-9]{10}$/i,
        },
      },
      isdeleted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      sequelize,
      modelName: "customers",
    }
  );
  return customers;
};
