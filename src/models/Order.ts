import { DataTypes, type Model } from "sequelize";
import { sequelize } from "../db/index.js";

type OrderStatus = "processing" | "shipped" | "delivered" | "cancelled";

//! snapshot of the address used when an Order has been placed (so the order history should have the right address, even if the User change his address later)
type OrderShippingAddress = {
  streetAddress: string;
  zipCode: string;
  city: string;
  country: string;
  companyName?: string | null;
  state?: string | null;
};

// !describes the attributes of an Order coming from the database
type OrderAttributes = OrderShippingAddress & {
  id: number;
  userId: number; //fk Pflichtfeld
  status: OrderStatus;
  isAdminOrder: boolean;
  //! PostgreSQL DECIMAL values ​​are often returned by Sequelize as strings(order.shippingCosts; "4.99")
  shippingCosts: string; //!postgreSQl returns DECIMAL values as strings
  firstName: string;
  lastName: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
};

//! describes the data (attributes) we need to create an order
type OrderCreationAttributes = OrderShippingAddress & {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  status?: OrderStatus; //the default is: "processing"
  isAdminOrder?: boolean; //the default is: false
  shippingCosts?: string | number; //the default is: 0
};

//! Model is normally a class, but here we use it as a type(Model<DatabaseAttributes, CreationAttributes>)
const Order = sequelize.define<Model<OrderAttributes, OrderCreationAttributes>>(
  "Order",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
    //! foreign key
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("processing", "shipped", "delivered", "cancelled"),
      allowNull: false,
      defaultValue: "processing",
    },
    isAdminOrder: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    shippingCosts: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    streetAddress: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    zipCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    country: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    state: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    //! timestamps:true per default
  },
);

export default Order;
