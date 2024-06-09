"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class cart extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      cart.belongsTo(models.customers, {
        foreignKey: "customer_id",
      });

      cart.belongsToMany(models.products, {
        through: models.cart_products,
        foreignKey: "cart_id",
      });

      
    }
  }
  cart.init(
    {
      customer_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "customers",
          key: "id",
        },
      },
    },
    {
      sequelize,
      modelName: "cart",
      freezeTableName: true,
    }
  );
  return cart;
};
