import assert from "node:assert/strict";
import { sequelize } from "../db/index.js";
import {
  User,
  Product,
  Category,
  UserFavorite,
} from "../models/associations.js";
import { randomUUID } from "node:crypto";
import { UniqueConstraintError } from "sequelize";

async function testCompositePrimaryKey() {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const owner = await User.create(
      {
        email: `test${randomUUID()}@email.com`,
        password: "testpassword",
      },
      { transaction },
    );
    const buyer = await User.create(
      {
        email: `test${randomUUID()}@email.com`,
        password: "testpassword",
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
        title: "Test Product",
        price: 100.0,
        description: "A test product",
        stock: 5,
        weightGrams: 1000,
        userId: owner.id,
        categoryId: category.id,
        image:
          "https://fastly.picsum.photos/id/254/300/300.jpg?hmac=nfKffzQbf7WwMaj1aRn9DspXwVNOFx1tMOj7p3ONMjU",
      },
      { transaction },
    );

    const userFavorite = await UserFavorite.create(
      {
        userId: buyer.id,
        productId: product.id,
      },
      { transaction },
    );

    assert.equal(userFavorite.userId, buyer.id);
    assert.equal(userFavorite.productId, product.id);

    await assert.rejects(
      () =>
        UserFavorite.create(
          {
            userId: buyer.id,
            productId: product.id,
          },
          { transaction },
        ),
      (error) => {
        assert.ok(error instanceof UniqueConstraintError);
        /*     assert.equal(error.name, "SequelizeUniqueConstraintError"); */
        assert.equal(error.original?.code, "23505");
        assert.equal(error.original?.constraint, "UserFavorites_pkey");

        return true;
      },
    );
    await transaction.rollback();

    console.log("✅UserFavorites PRIMARY KEY test passed");
  } catch (err) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }

    throw err;
  }
}

// user → favoriteProducts (deleting the buyer will lead to deletion of the favorite record)
/*
Buyer  → deleted
favorite record → automatically deleted
Product  → remains not deleted
 */
async function testCascadeUser() {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const owner = await User.create(
      {
        email: `test${randomUUID()}@email.com`,
        password: "testpassword",
      },
      { transaction },
    );
    const buyer = await User.create(
      {
        email: `test${randomUUID()}@email.com`,
        password: "testpassword",
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
        title: "Test Product",
        price: 100.0,
        description: "A test product",
        stock: 5,
        weightGrams: 1000,
        userId: owner.id,
        categoryId: category.id,
        image:
          "https://fastly.picsum.photos/id/254/300/300.jpg?hmac=nfKffzQbf7WwMaj1aRn9DspXwVNOFx1tMOj7p3ONMjU",
      },
      { transaction },
    );

    const userFavorite = await UserFavorite.create(
      {
        userId: buyer.id,
        productId: product.id,
      },
      { transaction },
    );

    assert.equal(userFavorite.userId, buyer.id);
    assert.equal(userFavorite.productId, product.id);
    //**********************************************

    // deletes buyer
    const deletedCount = await User.destroy({
      where: { id: buyer.id },
      transaction,
    });
    assert.equal(deletedCount, 1);

    const deletedBuyer = await User.findByPk(buyer.id, { transaction });
    assert.equal(deletedBuyer, null);

    // asserts buyer favorite record is also deleted
    const deletedFavorite = await UserFavorite.findOne({
      where: {
        userId: buyer.id,
        productId: product.id,
      },
      transaction,
    });

    assert.equal(deletedFavorite, null);

    //**********************************************
    // asserts product is not deleted, even if buyer is deleted
    const remainingProduct = await Product.findByPk(product.id, {
      transaction,
    });

    assert.ok(remainingProduct);

    assert.equal(remainingProduct.userId, owner.id);

    //**********************************************

    await transaction.rollback();
    console.log("✅cascade user test passed");
  } catch (error) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    throw error;
  }
}

// product → favoritedBy (deleting the product will lead to deletion of the favorite record)

/*
Product  → deleted
favorite record → automatically deleted
Buyer  → remains not deleted
 */

async function testCascadeProduct() {
  let transaction;
  try {
    transaction = await sequelize.transaction();

    const owner = await User.create(
      {
        email: `test${randomUUID()}@email.com`,
        password: "testpassword",
      },
      { transaction },
    );

    const buyer = await User.create(
      {
        email: `test${randomUUID()}@email.com`,
        password: "testpassword",
      },
      { transaction },
    );

    const category = await Category.create(
      {
        name: `category${randomUUID()}`,
      },
      { transaction },
    );

    const product = await Product.create(
      {
        title: "Test Product",
        price: 100.0,
        description: "A test product",
        stock: 5,
        weightGrams: 3000,
        userId: owner.id,
        categoryId: category.id,
        image:
          "https://fastly.picsum.photos/id/254/300/300.jpg?hmac=nfKffzQbf7WwMaj1aRn9DspXwVNOFx1tMOj7p3ONMjU",
      },
      { transaction },
    );

    const buyerWithFavoriteProduct = await UserFavorite.create(
      {
        userId: buyer.id,
        productId: product.id,
      },
      { transaction },
    );

    assert.equal(buyerWithFavoriteProduct.productId, product.id);
    assert.equal(buyerWithFavoriteProduct.userId, buyer.id);

    const deletedProductCount = await Product.destroy({
      where: { id: product.id },
      transaction,
    });
    assert.equal(deletedProductCount, 1);

    const foundDeletedProduct = await Product.findOne({
      where: { id: product.id },
      transaction,
    });
    assert.equal(foundDeletedProduct, null);

    const remainingFavorite = await UserFavorite.findOne({
      where: {
        userId: buyerWithFavoriteProduct.userId,
        productId: buyerWithFavoriteProduct.productId,
      },
      transaction,
    });
    //asserts favorite record is deleted
    assert.equal(remainingFavorite, null);

    const remainingBuyer = await User.findByPk(buyer.id, { transaction });
    //asserts buyer is not deleted
    assert.ok(remainingBuyer);

    assert.equal(remainingBuyer.id, buyer.id);

    const remainingOwner = await User.findByPk(owner.id, { transaction });
    // assert owner is not deleted
    assert.ok(remainingOwner);
    assert.equal(remainingOwner.id, owner.id);

    // operations
    await transaction.rollback();
    console.log("✅ Cascade product test passed");
  } catch (err) {
    if (transaction && !transaction.finished) {
      await transaction.rollback();
    }
    throw err;
  }
}

try {
  await testCompositePrimaryKey();
  await testCascadeUser();

  await testCascadeProduct();

  console.log("✅All current UserFavorites tests passed");
} catch (err) {
  console.error(err);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
