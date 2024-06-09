"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class category extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      category.belongsToMany(models.products, {
        through: models.product_category,
        foreignKey:'category_id'
      });
    }
  }
  category.init(
    {
      name: {
        type: DataTypes.STRING,
      },
      desc: {
        type: DataTypes.STRING,
      },
    },
    {
      sequelize,
      modelName: "category",
      freezeTableName: true,
    }
  );
  return category;
};
