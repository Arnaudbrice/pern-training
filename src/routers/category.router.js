import express from "express";
import { createCategory } from "../controllers/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.route("/").post(createCategory);

export default categoryRouter;
