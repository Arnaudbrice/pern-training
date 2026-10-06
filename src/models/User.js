import { DataTypes } from "sequelize";
import { sequelize } from "../db/index.js";

const User = sequelize.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },

  {
    defaultScope: {
      attributes: { exclude: ["password"] },
    },
    scopes: { withPassword: { attributes: {} } },
  },
);

export default User;
