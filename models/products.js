"use strict";
const { Model } = require("sequelize");
const product_category = require("./product_category");
module.exports = (sequelize, DataTypes) => {
  class products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      products.belongsToMany(models.cart, {
        through: models.cart_products,
        foreignKey:'product_id'
      });

      products.belongsToMany(models.category, {
        through: models.product_category,
        foreignKey:'product_id'
      });

      products.belongsToMany(models.seller, {
        through: models.seller_product,
        foreignKey:'product_id'
      });

      products.belongsToMany(models.order, {
        through: models.order_product,
        foreignKey:'product_id'
      });
      
    }
  }
  products.init(
    {
      name: {
        type: DataTypes.STRING,
      },
      desc: {
        type: DataTypes.STRING,
      },
      price: {
        type: DataTypes.FLOAT,
      },
      image_url: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "products",
      freezeTableName: true,
    }
  );
  return products;
};
