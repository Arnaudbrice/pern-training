import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { ForeignKeyConstraintError, UniqueConstraintError } from "sequelize";
import { sequelize } from "../db/index.js";
import { Category, Product, Review, User } from "../models/associations.js";

async function testCompositeUnique() {
  let transaction;
  try {
    // unmanaged transaction
    transaction = await sequelize.transaction();

    const user = await User.create(
      {
        email: `test-${randomUUID()}@user.com`,
        password: "testPassword",
      },
      { transaction },
    );

    const category = await Category.create(
      {
        name: `Test Category${randomUUID()}`,
      },
      { transaction },
    );

    const product = await Product.create(
      {
        image:
          "https://fastly.picsum.photos/id/234/300/300.jpg?hmac=h_wyR2RyqWlWBClKUtEB0PtIVBMKrf42kUI7IFbJ-UQ",
        title: "Test Product",
        price: 100.99,
        description: "Test Product Description",
        stock: 50,
        weightGrams: 1500,
        userId: user.id,
        categoryId: category.id,
      },
      { transaction },
    );

    const review = await Review.create(
      {
        userId: user.id,
        productId: product.id,
        rating: 4,
        comment: "nice product",
      },
      { transaction },
    );

    await assert.rejects(
      () =>
        Review.create(
          {
            userId: user.id,
            productId: product.id,
            rating: 5,
            comment: "very nice product",
          },
          { transaction },
        ),
      (error) => {
        assert.ok(error instanceof UniqueConstraintError);

        assert.equal(error.original?.code, "23505");

        assert.equal(
          error.original?.constraint,
          "reviews_productId_userId_unique",
        );

        return true;
      },
    );

    await transaction.rollback();
    console.log("✅ Review UNIQUE constraint test passed");
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
    // unmanaged transaction
    transaction = await sequelize.transaction();

    const owner = await User.create(
      {
        email: `owner-${randomUUID()}@user.com`,
        password: "testPassword",
      },
      { transaction },
    );
    const reviewer = await User.create(
      {
        email: `reviewer-${randomUUID()}@user.com`,
        password: "testPassword",
      },
      { transaction },
    );

    const category = await Category.create(
      {
        name: `Test Category${randomUUID()}`,
      },
      { transaction },
    );

    const product = await Product.create(
      {
        image:
          "https://fastly.picsum.photos/id/234/300/300.jpg?hmac=h_wyR2RyqWlWBClKUtEB0PtIVBMKrf42kUI7IFbJ-UQ",
        title: "Test Product",
        price: 100.99,
        description: "Test Product Description",
        stock: 50,
        weightGrams: 1500,
        userId: owner.id,
        categoryId: category.id,
      },
      { transaction },
    );

    const review = await Review.create(
      {
        userId: reviewer.id,
        productId: product.id,
        rating: 4,
        comment: "nice product",
      },
      { transaction },
    );

    const rowCount = await User.destroy({
      where: { id: reviewer.id },
      transaction,
    });
    assert.ok(rowCount === 1);

    // deletes a reviewer will also delete its reviews
    const deletedReview = await Review.findByPk(review.id, {
      transaction,
    });
    assert.equal(deletedReview, null);

    const remainingProduct = await Product.findByPk(product.id, {
      transaction,
    });
    assert.ok(remainingProduct);
    assert.ok(remainingProduct.userId, owner.id);

    await transaction.rollback();

    console.log("✅ Review CASCADE constraint test passed");
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
    // unmanaged transaction
    transaction = await sequelize.transaction();

    const user = await User.create(
      {
        email: `test-${randomUUID()}@user.com`,
        password: "testPassword",
      },
      { transaction },
    );

    const category = await Category.create(
      {
        name: `Test Category${randomUUID()}`,
      },
      { transaction },
    );

    const product = await Product.create(
      {
        image:
          "https://fastly.picsum.photos/id/234/300/300.jpg?hmac=h_wyR2RyqWlWBClKUtEB0PtIVBMKrf42kUI7IFbJ-UQ",
        title: "Test Product",
        price: 100.99,
        description: "Test Product Description",
        stock: 50,
        weightGrams: 1500,
        userId: user.id,
        categoryId: category.id,
      },
      { transaction },
    );

    const review = await Review.create(
      {
        userId: user.id,
        productId: product.id,
        rating: 4,
        comment: "nice product",
      },
      { transaction },
    );

    assert.rejects(
      () =>
        sequelize.query('DELETE FROM "Products" WHERE "id "= $1', {
          bind: [product.id],
          transaction,
        }),
      (error) => {
        assert.ok(error instanceof ForeignKeyConstraintError);

        assert.equal(error.original?.code, "23503");
        assert.equal(error.original?.constraint, "Reviews_productId_fkey");
        return true;
      },
    );

    await transaction.rollback();

    console.log("✅ Review RESTRICT constraint test passed");
  } catch (err) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    throw err;
  }
}

try {
  await testCompositeUnique();

  await testCascade();

  await testRestrict();

  console.log("all constraint tests passed successfully");
} catch (err) {
  console.error(err);
  // reports the failed test run without immediately exiting Node.js
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
