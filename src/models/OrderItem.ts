import { DataTypes, type Model } from "sequelize";
import { sequelize } from "../db/index.js";

type OrderItemAttributes = {
  id: number;
  orderId: number; //!fk Pflichtfeld
  productId: number; //!fk Pflichtfeld
  image: string;
  title: string;
  description: string;
  unitPrice: string; //postgreSQL returns DECIMAL values as strings

  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

// at the creation we can use number or string for unitPrice
type OrderItemCreationAttributes = Omit<
  OrderItemAttributes,
  "id" | "unitPrice" | "createdAt" | "updatedAt"
> & { unitPrice: number | string };

const OrderItem = sequelize.define<
  Model<OrderItemAttributes, OrderItemCreationAttributes>
>("OrderItem", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  orderId: {
    //! foreign key(will be defined in the association file and in the migration file)
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  productId: {
    //! foreign key(will be defined in the association file and in the migration file)
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  // ! // Snapshot of the product information at the time the order was placed.
  //! This ensures that the order history remains unchanged if the product is updated later.
  image: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  //! title: STRING, required
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  // description: TEXT, required
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  unitPrice: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },

  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    //! application-level validation
    validate: {
      min: 1,
    },
  },

  createdAt: DataTypes.DATE,
  updatedAt: DataTypes.DATE,
});

export default OrderItem;
