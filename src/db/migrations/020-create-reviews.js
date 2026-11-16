"use strict";
/**@type {import("sequelize-cli").Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.createTable(
        "Reviews",
        {
          id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false,
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
          userId: {
            type: Sequelize.INTEGER,
            references: {
              model: "Users",
              key: "id",
            },
            allowNull: false,
            onDelete: "CASCADE",
            onUpdate: "CASCADE",
          },
          rating: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          comment: {
            type: Sequelize.TEXT,
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

      //! add composite unique (productId, userId) constraint on productId and userId (to prevent duplicate reviews)

      await queryInterface.addIndex("Reviews", ["productId", "userId"], {
        name: "reviews_productId_userId_unique",
        unique: true,
        transaction,
      });

      await queryInterface.addConstraint("Reviews", {
        fields: ["rating"],
        type: "check",
        name: "ck_reviews_rating",
        where: {
          rating: { [Sequelize.Op.between]: [1, 5] },
        },
        transaction,
      });
    });
  },
  async down(queryInterface) {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.dropTable("Reviews", { transaction });
    });
  },
};
