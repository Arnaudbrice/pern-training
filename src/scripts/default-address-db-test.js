import assert from "node:assert/strict";
import { sequelize } from "../db/index.js";

import { Address, User } from "../models/associations.js";

let transaction;

try {
  transaction = await sequelize.transaction();
  const email = `test-${Date.now()}@example.com`;
  const user = await User.create(
    {
      email,
      password: "testPassword",
    },
    { transaction },
  );

  const address1 = await Address.create(
    {
      userId: user.id,
      streetAddress: "123 Main St",
      city: "Anytown",
      zipCode: "12345",
      country: "Country",
    },
    { transaction },
  );

  const address2 = await Address.create(
    {
      userId: user.id,
      streetAddress: "456 Elm St",
      city: "Zuadiku",
      zipCode: "12365",
      country: "Micronesia",
    },
    { transaction },
  );

  await user.update({ defaultAddressId: address1.id }, { transaction });

  const userWithDefaultAddress = await User.findByPk(user.id, {
    include: [
      {
        model: Address,
        as: "defaultAddress",
      },
    ],
    transaction,
  });
  if (!userWithDefaultAddress) {
    throw new Error("User not found", { cause: 404 });
  }

  //check default address is not null (ok check if the given value is truthy)
  assert.ok(userWithDefaultAddress.defaultAddress);

  assert.equal(
    userWithDefaultAddress.defaultAddress.streetAddress,
    address1.streetAddress,
  );
  assert.equal(userWithDefaultAddress.defaultAddress.city, address1.city);
  assert.equal(userWithDefaultAddress.defaultAddress.zipCode, address1.zipCode);
  assert.equal(userWithDefaultAddress.defaultAddress.country, address1.country);

  // !deletes default address of the user (referenced address deleted→user default address is set to null)
  await address1.destroy({ transaction });

  // !checks if user default address is set to null after deleting referenced address
  const userWithDefaultAddressAfterDelete = await User.findByPk(user.id, {
    include: [
      {
        model: Address,
        as: "defaultAddress",
      },
    ],
    transaction,
  });

  if (!userWithDefaultAddressAfterDelete) {
    throw new Error("User not found", { cause: 404 });
  }

  assert.equal(userWithDefaultAddressAfterDelete.defaultAddress, null);
  assert.equal(userWithDefaultAddressAfterDelete.defaultAddressId, null);

  // !checks if the second address is still existing for this user

  const foundAddress2 = await Address.findByPk(address2.id, { transaction });
  if (!foundAddress2) {
    throw new Error("Address not found", { cause: 404 });
  }
  assert.ok(foundAddress2, "second address must exist");
  assert.equal(foundAddress2.id, address2.id);

  await transaction.rollback();
  console.log("✅ Default address DB test passed");
} catch (err) {
  if (transaction && !transaction.finished) {
    await transaction.rollback();
  }

  console.error(err);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
