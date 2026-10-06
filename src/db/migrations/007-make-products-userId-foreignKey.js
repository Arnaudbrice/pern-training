"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    // TODO:
    // Foreign-Key-Constraint auf Products.userId hinzufügen
    // Referenz: Users.id
    // onDelete: RESTRICT
    // onUpdate: CASCADE

    await queryInterface.addConstraint("Products", {
      fields: ["userId"],
      type: "foreign key",
      name: "fk_products_userId", //constraint name
      references: {
        table: "Users",
        field: "id",
      },
      onDelete: "RESTRICT",
      onUpdate: "CASCADE",
    });
  },

  async down(queryInterface) {
    // remove foreign key constraint from the Products table
    await queryInterface.removeConstraint("Products", "fk_products_userId");
  },
};
