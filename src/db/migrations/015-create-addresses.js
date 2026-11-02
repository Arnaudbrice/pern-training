"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // uses managed transaction for automatically commit and rollback the transaction
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        "Addresses",
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          userId: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: "Users",
              key: "id",
            },
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
          },
          firstName: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          lastName: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          companyName: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          phone: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          streetAddress: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          city: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          state: {
            type: Sequelize.STRING,
            allowNull: true,
          },
          zipCode: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          country: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          label: {
            type: Sequelize.STRING,
            allowNull: false,
            defaultValue: "shippingAddress",
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
        {
          transaction,
        },
      );
    });
  },

  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable("Addresses", { transaction });
    });
  },
};
