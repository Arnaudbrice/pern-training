/**@type {import("sequelize-cli").Migration}*/

module.exports = {
  async up(queryInterface, Sequelize) {
    // !managed transaction (automatically commit or rollback the transaction)
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.addColumn(
        "Users",
        "role",
        {
          type: Sequelize.ENUM("user", "admin"),
          allowNull: false,
          defaultValue: "user",
        },
        { transaction },
      );

      await queryInterface.addColumn(
        "Users",
        "userAvatar",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        "Users",
        "resetToken",
        {
          type: Sequelize.STRING,
          allowNull: true,
        },
        { transaction },
      );

      await queryInterface.addColumn(
        "Users",
        "resetTokenExpiration",
        {
          type: Sequelize.DATE,
          allowNull: true,
        },
        { transaction },
      );
    });
  },
  async down(queryInterface) {
    // !managed transaction (automatically commit or rollback the transaction)
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.removeColumn("Users", "role", { transaction });

      await queryInterface.removeColumn("Users", "userAvatar", { transaction });
      await queryInterface.removeColumn("Users", "resetToken", { transaction });
      await queryInterface.removeColumn("Users", "resetTokenExpiration", {
        transaction,
      });

      // drop enum type
      await queryInterface.dropEnum("enum_Users_role", { transaction });
    });

    /*  await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_Users_role"',
    ); */
  },
};
