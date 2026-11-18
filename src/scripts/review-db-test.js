import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { sequelize } from "../db/index.js";
import { Category, Product, Review, User } from "../models/associations.js";

let transaction;

try {
  // unmanaged transaction
  transaction = await sequelize.transaction();
  const user = await User.create(
    {
      email: `test-${randomUUID()}@email.com`,

      password: "testpassword",
    },
    {
      transaction,
    },
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
        "https://fastly.picsum.photos/id/790/300/300.jpg?hmac=jXjdU1D_tMJC9_oX744nIo2DeE65T9ri0pJUM3k86E8",
      title: "Test Product",
      price: 100.0,
      description: "A test product",
      stock: 10,
      weightGrams: 1000,
      userId: user.id,
      categoryId: category.id,
    },
    { transaction },
  );

  const review = await Review.create(
    {
      productId: product.id,
      userId: user.id,
      rating: 5,
      comment: "This product is great!",
    },
    { transaction },
  );

  // product → reviews → user
  const productWithReviews = await Product.findByPk(product.id, {
    include: [
      {
        model: Review,
        as: "reviews",
        include: [
          {
            model: User,
            as: "user",
          },
        ],
      },
    ],
    transaction,
  });

  assert.ok(productWithReviews);

  assert.ok(productWithReviews.reviews);
  assert.equal(productWithReviews.reviews.length, 1);

  assert.equal(productWithReviews.reviews[0].user.id, user.id);

  assert.equal(productWithReviews.reviews[0].rating, review.rating);

  assert.equal(productWithReviews.reviews[0].comment, review.comment);
  assert.equal(productWithReviews.reviews[0].productId, product.id);

  // user → reviews → product
  const userWithReviews = await User.findByPk(user.id, {
    include: [
      {
        model: Review,
        as: "reviews",
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

  assert.ok(userWithReviews);
  assert.ok(userWithReviews.reviews);
  assert.equal(userWithReviews.reviews.length, 1);

  assert.equal(userWithReviews.reviews[0].rating, review.rating);
  assert.equal(userWithReviews.reviews[0].comment, review.comment);
  assert.equal(userWithReviews.reviews[0].product.id, product.id);
  assert.equal(userWithReviews.reviews[0].product.title, product.title);

  //!tests check-constraint

  await assert.rejects(
    () =>
      sequelize.query(
        'UPDATE "Reviews" SET "rating" = 0 WHERE "productId"= $1 AND "userId" = $2',
        {
          bind: [product.id, user.id],
          transaction,
        },
      ),
    (error) => {
      assert.equal(error.name, "SequelizeDatabaseError");
      //checks if the sequelize query throws a  postgreSQL check error 23514 and if the constraint name is ck_reviews_rating
      assert.equal(error.original?.code, "23514");

      assert.equal(error.original?.constraint, "ck_reviews_rating");
      return true;
    },
  );

  // tests composite unique constraint

  // tests cascade constraint (delete a user with his reviews)

  // tests restrict constraint (product cannot be deleted if it has been reviewed)

  await transaction.rollback();

  console.log("Review test passed!✅");
} catch (err) {
  if (transaction && !transaction.finished) {
    await transaction.rollback();
  }

  throw err;
} finally {
  await sequelize.close();
}
