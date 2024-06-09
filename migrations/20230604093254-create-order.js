"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("order", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      customer_id: {
        type: Sequelize.INTEGER,
        references: {
          model: "customers",
          key: "id",
        },
      },
      order_date: {
        type: Sequelize.DATE,
      },
      total_amount: {
        type: Sequelize.FLOAT,
      },
      shipping_address: {
        type: Sequelize.STRING,
      },
      status: {
        type: Sequelize.STRING,
        isIn: [["pending", "processing", "completed", "canceled"]],
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("order");
  },
};
