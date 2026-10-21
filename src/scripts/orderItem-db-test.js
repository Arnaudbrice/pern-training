import bcrypt from "bcrypt";

import {
  User,
  Category,
  Product,
  Order,
  OrderItem,
} from "../models/associations.js";

import { sequelize } from "../db/index.js";

try {
  // !the Tables, that first should be created, can be check on the ER-Diagram
  // TODO 1: Test-User erstellen
  // User.create()
  const user = await User.create({
    email: "pern-test@example.invalid",
    password: await bcrypt.hash("pern-test@example.invalid", 10),
  });
  // email und gehashtes password
  console.log("email", user.email);

  // TODO 2: Category erstellen

  const category = await Category.create({
    name: "Test Category",
  });

  // TODO 3: Product erstellen

  const product = await Product.create({
    title: "Test Product",
    description: "Test Product Description",
    price: 100.99,
    image: "https://example.com/test-product.jpg",
    stock: 10,
    categoryId: category.id,
    userId: user.id,
  });

  // title, description, price, image,
  // stock, categoryId, userId
  // TODO 4: Order erstellen

  const order = await Order.create({
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
  });
  // TODO 5: OrderItem erstellen

  const orderItem = await OrderItem.create({
    orderId: order.id,
    productId: product.id,
    // product snapshot
    image: product.image,
    title: product.title,
    description: product.description,
    unitPrice: product.price,
    quantity: 1,
  });

  // TODO 6: Order mit verschachteltem
  // include aus PostgreSQL abrufen

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
  });
  // TODO 7: Prüfen, ob die Order existiert
  // und Bestellpositionen (orderItems) geladen wurden
  if (!orderWithItems) {
    throw new Error("Order not found");
  }

  if (orderWithItems.orderItems.length === 0) {
    throw new Error("Order has no items");
  }
  // TODO 8: ID, quantity, unitPrice
  // und den Produktnamen ausgeben

  console.log(orderWithItems.id);
  console.log(orderWithItems.orderItems[0].quantity);
  console.log(orderWithItems.orderItems[0].unitPrice);
  //current title
  console.log(orderWithItems.orderItems[0].product.title);
  // snapshot title for the order history
  console.log(orderWithItems.orderItems[0].title);
} catch (error) {
  console.error(error);
  process.exitCode = 1;
} finally {
  await sequelize.close();
}
