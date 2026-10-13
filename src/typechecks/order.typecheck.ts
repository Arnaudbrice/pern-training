import Order from "../models/Order.js";

const validOrder = Order.build({
  userId: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  streetAddress: "123 Main St",
  zipCode: "12345",
  city: "New York",
  country: "USA",
});

const invalidOrder = Order.build({
  userId: 2,
  firstName: "Arnaud",
  lastName: "Nono",
  email: "arnaud.nono@example.com",
  // @ts-expect-error: "shipping" ist kein gültiger OrderStatus
  status: "shipping",
  streetAddress: "123 Main St",
  zipCode: "12345",
  city: "New York",
  country: "USA",
});

// @ts-expect-error: zipCode ist ein Pflichtfeld
const invalidOrder2 = Order.build({
  userId: 1,
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  streetAddress: "123 Main St",
  city: "New York",
  country: "USA",
});
