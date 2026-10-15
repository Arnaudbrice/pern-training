import bcrypt from "bcrypt";
import User from "../models/User.js";
import { sequelize } from "../db/index.js";
//! generates a test user with a temporary password and prints the user id to the console
try {
  // generates a hashed password with bcrypt with a salt with cost factor 10
  const hashedPassword = await bcrypt.hash("temporary-test-password", 10);

  const user = await User.create({
    email: "pern-test@example.invalid",
    password: hashedPassword,
  });

  // TODO 2:
  // Gib ausschließlich die ID des neuen Users aus.
  console.log(user.id);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
