"use strict";
//! imports the Sequelize class and the Sequelize CLI for better autocompletion
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    //! "Users" refers to the table name (pluralized)
    await queryInterface.createTable("Users", {
      id: {
        type: Sequelize.NUMBER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      //! Since timestamps were not defined in the Model definition, it is true by default (createdAt and updatedAt are automatically created), that's why createdAt and updatedAt are expected in the migration
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("Users");
  },
};
