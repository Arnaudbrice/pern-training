import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { sequelize } from "../db/index.js";

import { Cart, User } from "../models/associations.js";

// Prove that when a user is deleted, PostgreSQL automatically removes their shopping cart
let transaction;
try {
  transaction = await sequelize.transaction();

  const user = await User.create(
    {
      email: `test${randomUUID()}@example.com`,
      password: "testPassword",
    },
    {
      transaction,
    },
  );

  const cart = await Cart.create(
    {
      userId: user.id,
    },
    {
      transaction,
    },
  );

  await user.destroy({ transaction });

  const foundCart = await Cart.findByPk(cart.id, { transaction });

  assert.equal(foundCart, null);

  await transaction.rollback();
  console.log("✅ Cart CASCADE test passed");
} catch (err) {
  if (transaction && !transaction.finished) {
    await transaction.rollback();
  }
  console.error(err);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
