import { Category } from "../models/associations.js";

export const createCategory = async (req, res, next) => {
  const { name } = req.body;
  try {
    const categoryExists = await Category.findOne({ where: { name } });

    if (categoryExists) {
      throw new Error("Category already exists", { cause: 409 });
    }

    const category = await Category.create({ name });

    return res.status(201).json(category);
  } catch (err) {
    return next(err);
  }
};
