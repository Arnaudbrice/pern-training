import Order from "../models/Order.ts";
import User from "../models/User.js";
import { sequelize } from "../db/index.js";

try {
  // Order mit id = 1 und userId = 1 löschen
  const rowCount = await Order.destroy({ where: { id: 1, userId: 1 } });
  if (rowCount === 0) throw new Error("Order not found", { cause: 404 });

  // User mit id = 1 und
  // email = "pern-test@example.invalid" löschen
  const deletedRowCount = await User.destroy({
    where: { id: 1, email: "pern-test@example.invalid" },
  });
  if (deletedRowCount === 0) throw new Error("User not found", { cause: 404 });
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
