import assert from "node:assert";
import { sequelize } from "../db/index.js";
import { Address, User } from "../models/associations.js";

import { randomUUID } from "node:crypto";

const transaction = await sequelize.transaction();

try {
  const email = `test-${randomUUID()}@example.com`;
  // create a user
  const user = await User.create(
    {
      email,
      password: "testpassword",
    },
    { transaction },
  );

  // create 2 addresses for the user

  await Address.create(
    {
      userId: user.id,
      firstName: "John",
      lastName: "Tester",
      streetAddress: "123 Test St",
      city: "Testville",
      state: "Testonia",
      zipCode: "12345",
      country: "Testland",
    },
    { transaction },
  );

  await Address.create(
    {
      userId: user.id,
      firstName: "Jane",
      lastName: "Tester",
      streetAddress: "456 Test Ave",
      city: "Testopolis",
      state: "Testonia",
      zipCode: "67890",
      country: "Testland",
    },
    { transaction },
  );

  const foundUser = await User.findByPk(user.id, {
    include: [
      {
        model: Address,
        as: "addresses",
      },
    ],
    transaction,
  });

  if (!foundUser) {
    throw new Error("User not found");
  }

  assert.equal(foundUser.addresses.length, 2);
  //! sequelize gives no guarantie about the order of element in the array, so we have to sort the firstNames before comparing them

  const addresses = foundUser.addresses;
  const firstNamesArray = addresses.map((address) => address.firstName).sort(); //alphabetical order

  //! deepEquals compares the content of both arrays including the order of the elements
  assert.deepEqual(firstNamesArray, ["Jane", "John"]);

  /*   assert.equal(foundUser.addresses[0].label, address1.label);
  assert.equal(foundUser.addresses[1].label, address2.label);
 */

  assert.ok(
    foundUser.addresses.every((address) => address.label === "shippingAddress"),
  );

  await transaction.rollback();
  console.log("✅ Address DB test passed – rollback successful");
} catch (err) {
  // executes rollback if the commit or rollback has not been finished yet.
  if (!transaction.finished) {
    await transaction.rollback();
  }
  console.error(err);
  // make the nodejs process exit with a non-zero exit code to indicate failure
  process.exitCode = 1;
} finally {
  // close the connnection to the database
  await sequelize.close();
}
