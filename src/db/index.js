import { Sequelize } from "sequelize";

// TODO D1.1: Erzeuge eine Sequelize-Instanz mit process.env.PG_URI.
// Dialect: postgres, logging: false
export const sequelize = new Sequelize(process.env.PG_URI, {
  dialect: "postgres",
  logging: false, //don't show result  from the execution of sql queries in the console
});

export async function connectDatabase() {
  // TODO D1.2: Teste die Verbindung mit sequelize.authenticate().
  try {
    await sequelize.authenticate();
    console.log("connection to the database has been established successfully");

    //! Creates missing tables for all defined Sequelize models.
    // await sequelize.sync();
  } catch (err) {
    console.error("unable to connect to the database: ", err);
    //! Terminate the Node.js process if the database connection fails.
    process.exit(1);
  }
}
