import express from "express";
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";

/* Ein Router prüft eingehende Requests auf passende Routen und ruft anschließend den zugeordneten Controller auf. */
// TODO D1.12: Importiere getProducts und getProduct.

const productRouter = express.Router();

// TODO D1.13: GET / -> alle Produkte

productRouter.route("/").get(getProducts).post(createProduct);
// TODO D1.14: GET /:id -> einzelnes Produkt
productRouter
  .route("/:id")
  .get(getProduct)
  .put(updateProduct)
  .delete(deleteProduct);

export default productRouter;
