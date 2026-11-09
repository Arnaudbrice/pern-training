"use strict";
/**@type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        "Products",
        "weightGrams",
        {
          type: Sequelize.INTEGER,
          allowNull: false,
        },
        { transaction },
      );

      await queryInterface.addConstraint("Products", {
        fields: ["weightGrams"],
        type: "check",
        name: "ck_products_weightGrams",
        where: {
          weightGrams: { [Sequelize.Op.gte]: 1 },
        },
        transaction,
      });
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn("Products", "weightGrams", {
        transaction,
      });
    });
  },
};
