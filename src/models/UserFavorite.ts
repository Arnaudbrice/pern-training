import { DataTypes, type Model } from "sequelize";
import { sequelize } from "../db/index.js";

// !UserFavorite model (join table between User and Product)

//a User can have many favorite products and a Product can be favorited by many Users(User and Product are related by a many-to-many relationship)

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
