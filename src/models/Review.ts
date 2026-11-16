import { DataTypes, type Model } from "sequelize";
import { sequelize } from "../db/index.js";

type ReviewAttributes = {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
};

type ReviewOptionalFields = "id" | "createdAt" | "updatedAt";
type ReviewCreationAttributes = Omit<ReviewAttributes, ReviewOptionalFields>;

const Review = sequelize.define<
  Model<ReviewAttributes, ReviewCreationAttributes>
>("Review", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  // !foreign key
  productId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // !foreign key
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  rating: {
    type: DataTypes.INTEGER,
    allowNull: false,
    // !application level validation
    validate: {
      min: 1,
      max: 5,
      isInt: true, // !ensure that the rating is an integer
    },
  },
  comment: {
    type: DataTypes.TEXT,
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

export default Review;
