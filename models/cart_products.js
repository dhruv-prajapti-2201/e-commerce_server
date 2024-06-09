"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cart_products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  cart_products.init(
    {
      cart_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "cart",
          key: "id",
        },
      },
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "products",
          key: "id",
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "cart_products",
    }
  );
  return cart_products;
};
