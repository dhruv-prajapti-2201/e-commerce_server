"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class seller_product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
  }
  seller_product.init(
    {
      product_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "products",
          key: "id",
        },
      },
      seller_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "seller",
          key: "id",
        },
      },
      quantity_in_stock: {
        type: DataTypes.INTEGER,
      },
    },
    {
      sequelize,
      modelName: "seller_product",
      freezeTableName: true,
    }
  );
  return seller_product;
};
