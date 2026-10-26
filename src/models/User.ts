import { DataTypes, type Model } from "sequelize";
import { sequelize } from "../db/index.js";

type UserAttributes = {
  id: number;
  email: string;
  password: string;
  role: "user" | "admin";
  userAvatar: string | null;
  resetToken: string | null;
  resetTokenExpiration: Date | null;
  createdAt: Date;
  updatedAt: Date;
};

type OptionalFields =
  | "role"
  | "userAvatar"
  | "resetToken"
  | "resetTokenExpiration";
type UserCreationAttributes = Omit<
  UserAttributes,
  "id" | "createdAt" | "updatedAt" | OptionalFields
> &
  Partial<Pick<UserAttributes, OptionalFields>>;

const User = sequelize.define<Model<UserAttributes, UserCreationAttributes>>(
  "User",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
      defaultValue: "user",
    },
    userAvatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    resetTokenExpiration: {
      type: DataTypes.DATE,
      allowNull: true,
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

  {
    defaultScope: {
      attributes: {
        exclude: ["password", "resetToken", "resetTokenExpiration"],
      },
    },
    scopes: {
      withPassword: {
        attributes: { exclude: ["resetToken", "resetTokenExpiration"] },
      },
    },
  },
);

export default User;
