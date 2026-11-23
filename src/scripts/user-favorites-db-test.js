import { randomUUID } from "node:crypto";
import { sequelize } from "../db/index.js";
import {
  User,
  Category,
  Product,
  UserFavorite,
} from "../models/associations.js";
import assert from "node:assert/strict";

let transaction;

try {
  // unmanaged transaction
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
      stock: 10,
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
  // User → favoriteProducts (include)
  const buyerWithFavorites = await User.findByPk(buyer.id, {
    include: [{ model: Product, as: "favoriteProducts" }],
    transaction,
  });

  assert.ok(buyerWithFavorites);
  assert.equal(buyerWithFavorites.favoriteProducts.length, 1);

  assert.equal(buyerWithFavorites.favoriteProducts[0].id, product.id);

  // Product → favoritedBy(include)
  const productWithBuyer = await Product.findByPk(product.id, {
    include: [
      {
        model: User,
        as: "favoritedBy",
      },
    ],
    transaction,
  });

  assert.ok(productWithBuyer);
  assert.equal(productWithBuyer.favoritedBy.length, 1);
  assert.equal(productWithBuyer.favoritedBy[0].id, buyer.id);

  await transaction.rollback();
  console.log(" ✅User with favorite test passed");
} catch (err) {
  if (transaction && !transaction.finished) {
    await transaction.rollback();
  }

  console.error(err);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
