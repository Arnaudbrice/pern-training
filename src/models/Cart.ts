import { DataTypes, type Model } from "sequelize";

import { sequelize } from "../db/index.js";

type CartAttributes = {
  id: number;
  userId: number;
  updatedAt: Date;
  createdAt: Date;
};

type CartCreationAttributes = Omit<
  CartAttributes,
  "id" | "createdAt" | "updatedAt"
>;

const Cart = sequelize.define<Model<CartAttributes, CartCreationAttributes>>(
  "Cart",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    // !foreign key to User
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true, //every user should have at most one cart
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
);

export default Cart;
