import { DataTypes, type Model } from "sequelize";
import { sequelize } from "../db/index.js";

type ProductAttributes = {
  id: number;
  image: string;
  title: string;
  price: string; // PostgreSQL DECIMAL values are read as strings by default.
  description: string;
  stock: number;
  weightGrams: number;
  userId: number;
  categoryId: number;
  createdAt: Date;
  updatedAt: Date;
};

// makes stock optional, because default value is 0
//postgreSQL converts price(string or number) to decimal automatically
type ProductCreationAttributes = Omit<
  ProductAttributes,
  "id" | "createdAt" | "updatedAt" | "price" | "stock"
> &
  Partial<Pick<ProductAttributes, "stock">> & { price: string | number };

const Product = sequelize.define<
  Model<ProductAttributes, ProductCreationAttributes>
>("Product", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
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
  weightGrams: {
    type: DataTypes.INTEGER,
    allowNull: false,

    validate: {
      // ! application level validation
      min: 1, //1 gram min weight
    },
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  categoryId: {
    type: DataTypes.INTEGER,
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
});

export default Product;
