'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('address', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references:{
          model:'customers',
          key:'id'
        }
      },
      address_line_1:{
        type:Sequelize.STRING,
      },
      address_line_2:{
        type:Sequelize.STRING,
      },
      city:{
        type:Sequelize.STRING
      },
      state:{
        type:Sequelize.STRING
      },
      pincode:{
        type:Sequelize.STRING
      },
      country:{
        type:Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    },
    
    );
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('address');
  }
};