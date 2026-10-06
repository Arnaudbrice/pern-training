"use strict";

/** @type{import('sequelize-cli').Migration} */

module.exports = {
  async up(queryInterface) {
    await queryInterface.addConstraint("Categories", {
      fields: ["name"],
      type: "unique",
      //! selbst vergebene contraint name, damit man sie im down wieder entfernen kann
      name: "unique_categories_name",
    });
  },
  async down(queryInterface) {
    await queryInterface.removeConstraint(
      "Categories",
      "unique_categories_name",
    );
  },
};
