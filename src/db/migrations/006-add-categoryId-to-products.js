"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "categoryId", {
      type: Sequelize.INTEGER,
      allowNull: false,
      //!add categoryId as foreign key to the Products table
      references: {
        model: "Categories",
        key: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });
  },
  async down(queryInterface) {
    await queryInterface.removeColumn("Products", "categoryId");
  },
};
