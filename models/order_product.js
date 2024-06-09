"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  order_product.init(
    {
      order_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "order",
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
      modelName: "order_product",
      freezeTableName: true,
    }
  );
  return order_product;
};
