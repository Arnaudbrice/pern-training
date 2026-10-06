"use strict";
/** @type{import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface) {
    await queryInterface.removeColumn("Products", "category");
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn("Products", "category", {
      type: Sequelize.ENUM("electronics", "clothing", "books"),
      allowNull: false,
    });
  },
};
