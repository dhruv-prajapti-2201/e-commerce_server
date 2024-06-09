"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class order extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      order.belongsToMany(models.products, {
        through: models.order_product,
        foreignKey: "order_id",
      });

      order.belongsTo(models.customers, {
        foreignKey: "customer_id",
      });
    }
  }
  order.init(
    {
      customer_id: {
        type: DataTypes.INTEGER,
        references: {
          model: "customers",
          key: "id",
        },
      },
      order_date: {
        type: DataTypes.DATE,
      },
      total_amount: {
        type: DataTypes.FLOAT,
      },
      shipping_address: {
        type: DataTypes.STRING,
      },
      status: {
        type: DataTypes.STRING,
        isIn: [["pending", "processing", "completed", "canceled"]],
      },
    },
    {
      sequelize,
      modelName: "order",
      freezeTableName: true,
    }
  );
  return order;
};
