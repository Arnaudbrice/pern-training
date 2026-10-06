// TODO D1.3: Importiere DataTypes und sequelize.
import { DataTypes } from "sequelize";

import { sequelize } from "../db/index.js";
// TODO D1.4: Definiere ein Product-Model mit:
// title: STRING, required
// price: DECIMAL(10,2), required
// description: TEXT, required
// category: STRING, required
// stock: INTEGER, default 0
// userId: INTEGER, required

const Product = sequelize.define("Product", {
  title: { type: DataTypes.STRING, allowNull: false },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
});

export default Product;
