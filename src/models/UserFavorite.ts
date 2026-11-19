import { DataTypes, type Model } from "sequelize";
import { sequelize } from "../db/index.js";

type UserFavoriteAttributes = {
  userId: number;
  productId: number;
  createdAt: Date;
  updatedAt: Date;
};

type UserFavoriteCreationAttributes = Omit<
  UserFavoriteAttributes,
  "createdAt" | "updatedAt"
>;

const UserFavorite = sequelize.define<
  Model<UserFavoriteAttributes, UserFavoriteCreationAttributes>
>(
  "UserFavorite",
  {
    //! userId and productId are composite primary key
    userId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
    },

    productId: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
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
  { tableName: "UserFavorites" },
);
export default UserFavorite;
