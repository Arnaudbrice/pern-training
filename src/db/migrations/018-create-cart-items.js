"use strict";

/**@type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // !managed transaction(automatically commit and rollback)
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        "CartItems",
        {
          id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
          },
          cartId: {
            type: Sequelize.INTEGER,
            references: {
              model: "Carts",
              key: "id",
            },
            allowNull: false,
            onDelete: "CASCADE", //deleting a cart should lead to the deletion of it cartItems
            onUpdate: "CASCADE",
          },

          productId: {
            type: Sequelize.INTEGER,
            references: {
              model: "Products",
              key: "id",
            },
            allowNull: false,
            onDelete: "RESTRICT",
            onUpdate: "CASCADE",
          },
          unitPrice: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
          },
          title: {
            type: Sequelize.STRING,
            allowNull: false,
          },

          image: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          description: {
            type: Sequelize.TEXT,
            allowNull: false,
          },
          quantity: {
            type: Sequelize.INTEGER,
            allowNull: false,
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

      // add composite unique (cardId, productId) constraint
      await queryInterface.addIndex("CartItems", ["cartId", "productId"], {
        name: "cartItems_cartId_productId_unique",
        unique: true,
        transaction,
      });

      await queryInterface.addConstraint("CartItems", {
        fields: ["quantity"],
        type: "check",
        name: "ck_cartItems_quantity",
        where: {
          quantity: { [Sequelize.Op.gte]: 1 },
        },
        transaction,
      });
    });
  },
  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable("CartItems", { transaction });
    });
  },
};
