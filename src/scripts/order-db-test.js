import Order from "../models/Order.ts";
import User from "../models/User.js";
import { sequelize } from "../db/index.js";

try {
  // 1. Existierenden Test-User suchen
  const user = await User.findByPk(1);

  if (!user) {
    throw new Error("Test user not found");
  }

  // 2. Eine Bestellung in PostgreSQL speichern
  const order = await Order.create({
    userId: user.id,
    firstName: "John",
    lastName: "Doe",
    email: "pern-test@example.invalid",
    streetAddress: "123 Main St",
    zipCode: "12345",
    city: "New York",
    country: "USA",
  });

  // 3. Gespeicherte Order über ihre ID abrufen

  const savedOrder = await Order.findByPk(order.id);

  // 4. Prüfen, ob die Order gefunden wurde

  if (!savedOrder) {
    throw new Error("Order not found");
  }

  // 5. ID und Status ausgeben

  console.log(savedOrder.id);
  console.log(savedOrder.status);
  console.log("Shipping costs:", savedOrder.shippingCosts);
  console.log("Admin order:", savedOrder.isAdminOrder);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
