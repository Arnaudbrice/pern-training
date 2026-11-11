import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { sequelize } from "../db/index.js";
import {
  Cart,
  CartItem,
  Category,
  Product,
  User,
} from "../models/associations.js";

let transaction;
try {
  // Unmanaged transaction
  transaction = await sequelize.transaction();
  // creates a user
  const user = await User.create(
    {
      email: `test-${randomUUID()}@user.com`,
      password: "testPassword",
    },
    { transaction },
  );

  // creates a cart for the user
  const cart = await Cart.create(
    {
      userId: user.id,
    },
    {
      transaction,
    },
  );

  // creates a category
  const category = await Category.create(
    {
      name: `Test Category${randomUUID()}`,
    },
    { transaction },
  );

  // creates a product
  const product = await Product.create(
    {
      image: "https://picsum.photos/300/300",
      title: "Test Product",
      price: 100.99,
      description: "Test Product Description",
      stock: 100,
      weightGrams: 1500,
      userId: user.id,
      categoryId: category.id,
    },
    { transaction },
  );

  // creates a cartItem

  const cartItem = await CartItem.create(
    {
      title: product.title,
      image: product.image,
      description: product.description,
      cartId: cart.id,
      productId: product.id,
      quantity: 2,
      unitPrice: product.price,
    },
    { transaction },
  );

  const foundCart = await Cart.findByPk(cart.id, {
    include: [
      {
        model: CartItem,
        as: "cartItems",
        include: [
          {
            model: Product,
            as: "product",
          },
        ],
      },
    ],
    transaction,
  });
  // checks if the cart is found
  assert.ok(foundCart);
  // checks if the cart has the correct number of cartItems
  assert.equal(foundCart.cartItems.length, 1);
  // checks if the cartItem quantity is correct
  assert.equal(foundCart.cartItems[0].quantity, 2);

  assert.ok(foundCart.cartItems[0].product);
  //checks if the productId of the cartItem matches the product.id
  assert.equal(foundCart.cartItems[0].productId, product.id);

  const totalWeight = foundCart.cartItems.reduce((weight, item) => {
    return weight + item.quantity * item.product.weightGrams;
  }, 0);
  //checks if the total weight is correct
  assert.equal(totalWeight, 3000);

  // loads cart with products over the (m:n) relationship

  const cartWithProduct = await Cart.findByPk(cart.id, {
    include: [
      {
        model: Product,
        as: "products",
      },
    ],
    transaction,
  });

  assert.ok(cartWithProduct);

  assert.equal(cartWithProduct.products.length, 1);
  assert.equal(cartWithProduct.products[0].id, product.id);

  await transaction.rollback();

  console.log("✅ CartItem associations and weight test passed");
} catch (err) {
  if (transaction && !transaction.finished) {
    await transaction.rollback();
  }

  console.error(err);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
