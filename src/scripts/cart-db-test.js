import assert from "node:assert/strict";
import { sequelize } from "../db/index.js";

import { Cart, User } from "../models/associations.js";
import { UniqueConstraintError } from "sequelize";
import { randomUUID } from "node:crypto";

let transaction;
try {
  transaction = await sequelize.transaction();

  const user = await User.create(
    {
      email: `test${randomUUID()}@example.com`,
      password: "testPassword",
    },
    { transaction },
  );

  const cart = await Cart.create(
    {
      userId: user.id,
    },
    {
      transaction,
    },
  );

  const foundUser = await User.findByPk(user.id, {
    include: [{ model: Cart, as: "cart" }],
    transaction,
  });
  // check if the user is found and has a cart
  assert.ok(foundUser);
  assert.ok(foundUser.cart);
  assert.equal(foundUser.cart.id, cart.id);
  assert.equal(foundUser.cart.userId, user.id);

  //! cart unique contraint test (creation of a second cart for the same user should throw an unique constraint error)

  await assert.rejects(() => {
    return Cart.create(
      {
        userId: user.id,
      },
      {
        transaction,
      },
    );
  }, UniqueConstraintError);

  await transaction.rollback();
  console.log("✅ Cart DB UNIQUE test passed – rollback successful");
} catch (err) {
  if (transaction && !transaction.finished) {
    await transaction.rollback();
  }
  console.error(err);
  //!indicates an error in the test suite
  process.exitCode = 1;
} finally {
  //!closes the database connection
  await sequelize.close();
}
