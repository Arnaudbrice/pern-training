"use strict";
/**@type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // uses managed transaction for automatically commit and rollback the transaction
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        "Users",
        "defaultAddressId",
        {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: "Addresses",
            key: "id",
          },
          onDelete: "SET NULL",
          onUpdate: "CASCADE",
        },
        { transaction },
      );
    });
  },
  async down(queryInterface) {
    // uses managed transaction
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn("Users", "defaultAddressId", {
        transaction,
      });
    });
  },
};
