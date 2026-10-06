import express from "express";
import productRouter from "./routers/product.router.js";
import errorHandler from "./middleware/errorHandler.js";

// ! associations must be loaded first before running database syncronisation or migration, so that sequelize knows the relationships and foreign keys that should be synchronized
import "./models/associations.js";
import { connectDatabase } from "./db/index.js";
import userRouter from "./routers/user.router.js";
import categoryRouter from "./routers/category.router.js";

const app = express();
// turns json request to js object accessible via req.body
app.use(express.json());

//! defines global middleware for  for test purpose
/* app.use((req, res, next) => {
  req.user = { id: 1, password: "123456" };

  next(); //forwards the request to the next middleware or route handler
}); */
/****** Route specific middleware setting ******/

// TODO D1.15: Verbinde die Product-Routes unter /api/products.

app.use("/api/users", userRouter);
app.use("/api/products", productRouter); //define the base path for all routes defined in  productRouter
app.use("/api/categories", categoryRouter);

// handle request for unknown routes
app.all("/{*splat}", (req, res) => {
  throw new Error("Page Not Found", { cause: 404 });
});

//! global middleware to handle errors
app.use(errorHandler);

const port = process.env.PORT || 3000;

await connectDatabase();
app.listen(port, () => console.log(`PERN refresh API running on ${port}`));
