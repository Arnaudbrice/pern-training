"use strict";
/**@type{import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Orders", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      //!userId is a foreign key
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Users",
          key: "id",
        },
        // nur Order mit zugeordnete user können gelöscht werden (nur Order mit user können gelöscht werden)
        onDelete: "RESTRICT",
        onUpdate: "CASCADE",
      },
      //! postgreSQL create an enum type called enum_Orders_status (can be used if we want to rollback the migration)
      status: {
        type: Sequelize.ENUM("processing", "shipped", "delivered", "cancelled"),
        allowNull: false,
        defaultValue: "processing",
      },
      isAdminOrder: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      shippingCosts: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      //! order address
      streetAddress: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      zipCode: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      city: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      country: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      companyName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      state: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      // timestamps:true per default in sequelize, but should be declared while creating the migration
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Orders");
    //! delete the created enum type (enum type are created separately from the table and the created enum type are used in the table) associated with the deleted Orders table
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Orders_status"',
    );
  },
};
