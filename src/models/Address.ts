import { DataTypes, type Model } from "sequelize";
import { sequelize } from "../db/index.js";

export type AddressAttributes = {
  id: number;
  userId: number;
  firstName: string | null;
  lastName: string | null;
  companyName: string | null;
  phone: string | null;
  streetAddress: string;
  city: string;
  state: string | null;
  zipCode: string;
  country: string;
  label: string;
  createdAt: Date;
  updatedAt: Date;
};

type OptionalFields =
  | "firstName"
  | "lastName"
  | "companyName"
  | "phone"
  | "state"
  | "label";
export type AddressCreationAttributes = Omit<
  AddressAttributes,
  "id" | "createdAt" | "updatedAt" | OptionalFields
> &
  Partial<Pick<AddressAttributes, OptionalFields>>;

const Address = sequelize.define<
  Model<AddressAttributes, AddressCreationAttributes>
>("Address", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  // !foreign key
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  firstName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  lastName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  companyName: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  streetAddress: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  state: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  zipCode: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  country: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  label: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "shippingAddress",
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
});

export default Address;
