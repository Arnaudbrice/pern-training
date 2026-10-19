// @ts-check
"use strict";

module.exports = {
  /**
   * @param {import("sequelize").QueryInterface} queryInterface
   */
  async up(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE "Products" RENAME CONSTRAINT "fk_products_userId" TO "Products_userId_fkey";',
    );
  },

  /**
   * @param {import("sequelize").QueryInterface} queryInterface
   */
  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'ALTER TABLE "Products" RENAME CONSTRAINT "Products_userId_fkey" TO "fk_products_userId";',
    );
  },
};
