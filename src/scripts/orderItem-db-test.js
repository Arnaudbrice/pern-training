import bcrypt from "bcrypt";

import {
  User,
  Category,
  Product,
  Order,
  OrderItem,
} from "../models/associations.js";

import { sequelize } from "../db/index.js";
import assert from "node:assert/strict";

let transaction;

try {
  transaction = await sequelize.transaction();
  // !the Tables, that first should be created, can be check on the ER-Diagram
  // TODO 1: Test-User erstellen
  // User.create()
  const user = await User.create(
    {
      email: "pern-test@example.invalid",
      password: await bcrypt.hash("temporary-test-password", 10),
    },
    { transaction },
  );
  // email und gehashtes password
  console.log("email", user.email);

  // TODO 2: Category erstellen

  const category = await Category.create(
    {
      name: "Test Category",
    },
    { transaction },
  );

  // TODO 3: Product erstellen

  const product = await Product.create(
    {
      title: "Test Product",
      description: "Test Product Description",
      price: 100.99,
      image: "https://example.com/test-product.jpg",
      stock: 10,
      categoryId: category.id,
      userId: user.id,
    },
    { transaction },
  );

  // title, description, price, image,
  // stock, categoryId, userId
  // TODO 4: Order erstellen

  const order = await Order.create(
    {
      userId: user.id,
      firstName: "John",
      lastName: "Doe",
      email: user.email,
      shippingCosts: 3.99,
      //  order shipping address
      streetAddress: "123 Main St",
      zipCode: "12345",
      city: "New York",
      country: "USA",
      status: "processing",
    },
    { transaction },
  );
  // TODO 5: OrderItem erstellen

  const orderItem = await OrderItem.create(
    {
      orderId: order.id,
      productId: product.id,
      // product snapshot
      image: product.image,
      title: product.title,
      description: product.description,
      unitPrice: product.price,
      quantity: 1,
    },
    { transaction },
  );

  //! Aktuellen Produktpreis ändern
  await product.update({ price: 150.99 }, { transaction });

  const orderWithItems = await Order.findByPk(order.id, {
    include: [
      {
        model: OrderItem,
        as: "orderItems",
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
  // TODO 7: Prüfen, ob die Order existiert
  // und Bestellpositionen (orderItems) geladen wurden
  if (!orderWithItems) {
    throw new Error("Order not found");
  }

  if (orderWithItems.orderItems.length === 0) {
    throw new Error("Order has no items");
  }

  /* um die Fehler bei der Datenbank-Test-Funktion zu finden, können die folgenden Befehle ausgeführt werden:
  node --check src/scripts/order-db-test.js
  dann
  node --env-file=.env src/scripts/orderItem-db-test.js
  */
  assert.equal(orderWithItems.orderItems.length, 1);

  const item = orderWithItems.orderItems[0];
  assert.equal(item.quantity, 1);
  //! Der historische Kaufpreis bleibt unverändert
  assert.equal(Number(item.unitPrice), 100.99);
  // !Produktpreis hat sich geändert
  assert.equal(Number(item.product.price), 150.99);
  console.log("Alle Prüfungen erfolgreich!");

  await transaction.rollback();
} catch (error) {
  if (transaction && !transaction.finished) {
    await transaction.rollback();
  }

  console.error(error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
