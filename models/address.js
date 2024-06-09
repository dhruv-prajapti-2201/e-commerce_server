'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class address extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      address.belongsTo(models.customers,{
        foreignKey: "customer_id"
      })
    }
  }
  address.init({
      customer_id: {
        type: DataTypes.INTEGER,
        references:{
          model:'customers',
          key:'id'
        }
      },
      address_line_1:{
        type:DataTypes.STRING,
      },
      address_line_2:{
        type:DataTypes.STRING,
      },
      city:{
        type:DataTypes.STRING
      },
      state:{
        type:DataTypes.STRING
      },
      pincode:{
        type:DataTypes.STRING
      },
      country:{
        type:DataTypes.STRING
      },
  }, {
    sequelize,
    modelName: 'address',
    freezeTableName:true
  });
  return address;
};