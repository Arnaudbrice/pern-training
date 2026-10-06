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
  onDelete: "RESTRICT", //!nur category ohne Product können gelöscht werden
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
  onDelete: "RESTRICT", //!nur user ohne product können gelöscht werden
});

export { Product, Category, User };
