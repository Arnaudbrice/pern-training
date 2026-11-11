import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { UniqueConstraintError } from "sequelize";
import { sequelize } from "../db/index.js";
import {
  Cart,
  CartItem,
  Category,
  Product,
  User,
} from "../models/associations.js";

async function testCompositeUnique() {
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

    //asserts adding same product multiple times to the cart will throw an unique constraint error
    await assert.rejects(
      () =>
        CartItem.create(
          {
            title: product.title,
            image: product.image,
            description: product.description,
            cartId: cart.id,
            productId: product.id,
            quantity: 1,
            unitPrice: product.price,
          },
          { transaction },
        ),
      UniqueConstraintError,
    );

    await transaction.rollback();

    console.log("✅ CartItem DB UNIQUE test passed – rollback successful");
  } catch (err) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    throw err;
  }
}

async function testQuantityCheck() {
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

    // asserts cartItem can not be created with a quantity<1 (database level constraint)
    // $1 ist ein Platzhalter. bind: [cartItem.id] übergibt dafür die CartItem-ID.
    await assert.rejects(
      () =>
        sequelize.query(
          'UPDATE "CartItems" SET "quantity" = 0 WHERE "id" = $1',
          {
            bind: [cartItem.id],
            transaction,
          },
        ),

      (error) => {
        assert.equal(error.name, "SequelizeDatabaseError");
        assert.equal(error.original?.code, "23514");
        assert.equal(error.original?.constraint, "ck_cartItems_quantity");
        return true;
      },
    );

    await transaction.rollback();

    console.log("✅ CartItem DB CHECK test passed – rollback successful");
  } catch (err) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    throw err;
  }
}

async function testCascade() {
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

    assert.equal(
      await CartItem.count({
        where: { cartId: cart.id },
        transaction,
      }),
      1,
    );

    await cart.destroy({ transaction });

    // asserts cartItem is also deleted
    const countCartItems = await CartItem.count({
      where: { cartId: cart.id },
      transaction,
    });
    assert.equal(countCartItems, 0);
    await transaction.rollback();

    console.log("✅ CartItem DB CASCADE test passed – rollback successful");
  } catch (err) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    throw err;
  }
}

async function testRestrict() {
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
        name: "Test Category",
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

    await assert.rejects(
      () =>
        sequelize.query('DELETE FROM "Products" WHERE "id" = $1', {
          bind: [product.id],
          transaction,
        }),
      (error) => {
        assert.equal(error.name, "SequelizeForeignKeyConstraintError");
        // PostgreSQL: foreign_key_violation code
        assert.equal(error.original?.code, "23503");
        assert.equal(error.original?.constraint, "CartItems_productId_fkey");
        return true;
      },
    );

    await transaction.rollback();

    console.log("✅ CartItem DB RESTRICT test passed – rollback successful");
  } catch (err) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    throw err;
  }
}

try {
  await testCompositeUnique();
  await testQuantityCheck();
  await testCascade();
  await testRestrict();

  console.log("✅ All CartItem constraint tests passed");
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
