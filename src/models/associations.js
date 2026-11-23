import Address from "./Address.ts";
import Cart from "./Cart.ts";
import CartItem from "./CartItem.ts";
import Category from "./Category.js";
import Order from "./Order.ts";
import OrderItem from "./OrderItem.ts";
import Product from "./Product.js";
import Review from "./Review.ts";
import User from "./User.ts";
import UserFavorite from "./UserFavorite.ts";

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
  onDelete: "RESTRICT", //!Category darf nicht gelöscht werden, solange Product darauf verweist
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
    allowNull: false,
  },
  as: "user",
  onDelete: "RESTRICT", //!User darf nicht gelöscht werden, solange ein Product darauf verweist
});

//********** User ↔ Product (M:N) **********

User.belongsToMany(Product, {
  through: UserFavorite, //!association table
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  otherKey: {
    name: "productId",
    allowNull: false,
  },
  as: "favoriteProducts",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

Product.belongsToMany(User, {
  through: UserFavorite, //!association table
  foreignKey: {
    name: "productId",
    allowNull: false,
  },
  otherKey: {
    name: "userId",
    allowNull: false,
  },
  as: "favoritedBy",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
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
  onDelete: "RESTRICT", //!User darf nicht gelöscht werden, solange Order darauf verweist
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
  onDelete: "RESTRICT", //!User darf nicht gelöscht werden, solange Address darauf verweist
});

//! every user can optionally have a default address
User.belongsTo(Address, {
  foreignKey: {
    name: "defaultAddressId",
    allowNull: true, //default address will be set by the user
  },
  as: "defaultAddress",
  onDelete: "SET NULL", //!defaultAddressId can be null if the referenced address is deleted
});

//********** User/Cart(1:1) **********

User.hasOne(Cart, {
  foreignKey: "userId",
  as: "cart",
});

Cart.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  as: "user",
  onDelete: "CASCADE", //if user is deleted, cart is also deleted
  onUpdate: "CASCADE",
});

//********** Cart/CartItem(1:n) **********

Cart.hasMany(CartItem, {
  foreignKey: "cartId",
  as: "cartItems",
});

CartItem.belongsTo(Cart, {
  foreignKey: {
    name: "cartId",
    allowNull: false,
  },
  as: "cart",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

//********** Product/CartItem(1:n) **********

Product.hasMany(CartItem, {
  foreignKey: "productId",
  as: "cartItems",
});

CartItem.belongsTo(Product, {
  foreignKey: {
    name: "productId",
    allowNull: false,
  },
  as: "product",
  onDelete: "RESTRICT",
  onUpdate: "CASCADE",
});

//********** Cart/Product(m:n) **********
// !cartItem is the association table
// !cartId is the foreign key in cartItem
// !productId is the foreign key in cartItem
Cart.belongsToMany(Product, {
  through: {
    model: CartItem,
  },
  foreignKey: {
    //!belongsToMany → foreignKey references the source model(cart)and is in the association table (cartItem)
    name: "cartId",
    allowNull: false,
  },
  otherKey: "productId", //the other foreignKey
  as: "products",
  onDelete: "CASCADE", //!default by (m:n) relationship (deleting a cart will automatically delete the cartItem records with its cartId)
  onUpdate: "CASCADE", //!default by (m:n) relationship
});

Product.belongsToMany(Cart, {
  through: {
    model: CartItem,
  },
  foreignKey: {
    //!belongsToMany → foreignKey references the source model(product) and is in the association table (cartItem)
    name: "productId",
    allowNull: false,
  },
  otherKey: "cartId", //the other foreignKey
  as: "carts",
  onDelete: "RESTRICT", //! Prevent deletion of a product if a cart in the cartItem table references this product
  onUpdate: "CASCADE",
});

//********** User/Review(1:N) **********
User.hasMany(Review, {
  foreignKey: "userId",
  as: "reviews",
});
Review.belongsTo(User, {
  foreignKey: {
    name: "userId",
    allowNull: false,
  },
  as: "user",
  onDelete: "CASCADE",
  onUpdate: "CASCADE",
});

//********** Product/Review(1:N) **********

Product.hasMany(Review, {
  foreignKey: "productId",
  as: "reviews",
});

Review.belongsTo(Product, {
  foreignKey: {
    name: "productId",
    allowNull: false,
  },
  as: "product",
  onDelete: "RESTRICT", //!Product darf nicht gelöscht werden, solange Review darauf verweist
  onUpdate: "CASCADE",
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
  onDelete: "RESTRICT", //!Order darf nicht gelöscht werden, solange OrderItem darauf verweist
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
  onDelete: "RESTRICT", //!Product darf nicht gelöscht werden, solange OrderItem darauf verweist
});

export {
  Address,
  Cart,
  CartItem,
  Category,
  Order,
  OrderItem,
  Product,
  Review,
  User,
  UserFavorite,
};
