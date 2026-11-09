import { DataTypes, type Model } from "sequelize";
import { sequelize } from "../db/index.js";

type CartItemProduct = {
  unitPrice: string; //postgreSQL return decimal value as string
  title: string;
  image: string;
  description: string;
};

type CartItemAttributes = CartItemProduct & {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

type CartItemOptionalFields = "id" | "unitPrice" | "createdAt" | "updatedAt";

type CartItemCreationAttributes = Omit<
  CartItemAttributes,
  CartItemOptionalFields
> & { unitPrice: string | number };

const CartItem = sequelize.define<
  Model<CartItemAttributes, CartItemCreationAttributes>
>(
  "CartItem",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    cartId: {
      //!foreign key (will be defined in the association and the migration file)
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    productId: {
      //!foreign key (will be defined in the association and the migration file)
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    //********** product snapshot **********
    unitPrice: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    image: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      //!application level validation
      validate: {
        min: 1,
      },
    },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },

  // Prevent duplicate product entries within the same cart
  // Cart ↔ Product = M:N through CartItem
  {
    indexes: [
      {
        unique: true,
        fields: ["cartId", "productId"],
        name: "cartItems_cartId_productId_unique",
      },
    ],
  },
);

export default CartItem;
