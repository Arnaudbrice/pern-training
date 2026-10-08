import Category from "./Category.js";
import Product from "./Product.js";
import User from "./User.js";

/****************************************
 *           Associations definition
 ****************************************/

//********** Category/Product (1:N) **********

//! foreign key und onDelete werden bei belongsTo() definiert (Product wird mit categoryId erweitert)
Product.belongsTo(Category, {
  foreignKey: {
    name: "categoryId",
    allowNull: false,
  },
  as: "category",
  onDelete: "RESTRICT", //!nur Product ohne zugeordnete category können gelöscht werden
});

Category.hasMany(Product, {
  foreignKey: "categoryId",
  as: "products",
});

/* should be checked by deleting category const productCount = await category.countProducts();

    if (productCount > 0) {
      throw new Error("Category still has products", { cause: 409 });
    } */

//********** User/product (1:N) **********
User.hasMany(Product, {
  foreignKey: "userId",
  as: "products",
});

//! (Product wird mit userId erweitert)
Product.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false, //!wichtig für onDelete restrict
  },
  as: "user",
  onDelete: "RESTRICT", //!nur Product ohne zugeordnete user können gelöscht werden
});

//********** User/Order (1:N) **********

User.hasMany(Order, {
  foreignKey: "userId",
  as: "orders",
});

Order.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  as: "user",
  onDelete: "RESTRICT", //!nur Order ohne zugeordnete user können gelöscht werden
});

//********** User/Address(1:N) **********

User.hasMany(Address, {
  foreignKey: "userId",
  as: "addresses",
});

Address.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  as: "user",
  onDelete: "RESTRICT", //!nur Address ohne zugeordnete user können gelöscht werden
});

//! every user has a default address
User.belongsTo(Address, {
  foreignKey: {
    name: "defaultAddressId",
    allowNull: true, //default address will be set by the user
  },
  as: "defaultAddress",
  onDelete: "RESTRICT", //!nur user ohne zugeordnete defaultAddress können gelöscht werden
});

//********** Order/OrderItem(1:N) **********

Order.hasMany(OrderItem, {
  foreignKey: "orderId",
  as: "orderItems",
});

OrderItem.belongsTo(Order, {
  foreignKey: {
    name: "orderId",
    allowNull: false,
  },
  as: "order",
  onDelete: "RESTRICT", //nur orderItem ohne zugeordnete order können gelöscht werden
});

//********** Product/OrderItem **********

Product.hasMany(OrderItem, {
  foreignKey: "productId",
  as: "orderItems",
});

OrderItem.belongsTo(Product, {
  foreignKey: {
    name: "productId",
    allowNull: false,
  },
  as: "product",
  onDelete: "RESTRICT", //nur orderItem ohne zugeordnete product können gelöscht werden
});

export { Product, Category, User };
