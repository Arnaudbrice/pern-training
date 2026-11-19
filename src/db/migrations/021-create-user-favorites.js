"use strict";
/**@type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        "UserFavorites",
        {
          userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true, //!first primary key for the composite primary key
            references: {
              model: "Users",
              key: "id",
            },
            onDelete: "CASCADE", //When a user is deleted, their favorite entries disappear.
            onUpdate: "CASCADE",
          },
          productId: {
            type: Sequelize.INTEGER,
            primaryKey: true, //!second primary key for the composite primary key
            allowNull: false,
            references: {
              model: "Products",
              key: "id",
            },
            onDelete: "CASCADE", //When a product is deleted, their favorite entries disappear.
            onUpdate: "CASCADE",
          },
          createdAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
          updatedAt: {
            type: Sequelize.DATE,
            allowNull: false,
          },
        },
        { transaction },
      );
    });
  },
  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable("UserFavorites", { transaction });
    });
  },
};
