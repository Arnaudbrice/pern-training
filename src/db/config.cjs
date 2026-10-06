require("dotenv").config();

module.exports = {
  development: {
    use_env_variable: "PG_URI",
    dialect: "postgres",
    logging: false,
  },
};
