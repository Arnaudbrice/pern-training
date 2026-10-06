// TODO D1.5: Importiere Product.

import { Product, Category, User } from "../models/associations.js";

export async function getProducts(req, res, next) {
  try {
    // TODO D1.6: Hole alle Produkte mit Sequelize.

    const products = await Product.findAll({
      include: [
        {
          model: Category,
          as: "category",
        },
        {
          model: User,
          as: "user",
        },
      ],
    });

    // TODO D1.7: Gib sie als JSON zurück.

    return res.json(products);
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req, res, next) {
  try {
    // TODO D1.8: Lies id aus req.params.

    const { id } = req.params;
    // TODO D1.9: Suche mit findByPk().
    const product = await Product.findByPk(id, {
      include: [
        {
          model: Category,
          as: "category",
        },
        {
          model: User,
          as: "user",
        },
      ],
    });
    if (!product) {
      // TODO D1.10: Wenn kein Produkt existiert -> Fehler mit Status 404.
      throw new Error("Product not found", { cause: 404 });
    }

    // TODO D1.11: Produkt als JSON zurückgeben.

    return res.json(product);
  } catch (error) {
    next(error);
  }
}

/**
 * Creates a new product.
 * @param {*} req - the request object
 * @param {*} res -the response object
 * @param {*} next - the next middleware function
 */

export const createProduct = async (req, res, next) => {
  const { title, price, description, categoryId, stock } = req.body;

  try {
    const category = await Category.findByPk(categoryId);
    // handle foreign key error (category not found)
    if (!category) {
      throw new Error("Category Not Found", { cause: 404 });
    }
    const product = await Product.create({
      title,
      price,
      description,
      categoryId,
      stock,
      userId: req.user.id,
    });

    //! status 201 wird im Gegensatz zu 200 nicht automatisch gesetzt
    return res.status(201).json(product);
  } catch (err) {
    next(err);
  }
};

/**
 * updates a product
 * @param {*} req - the request object
 * @param {*} res - the response object
 * @param {*} next - the next middleware function
 */
export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { title, price, description, categoryId, stock } = req.body;
  try {
    const category = await Category.findByPk(categoryId);
    // handle foreign key error (category not found)
    if (!category) {
      throw new Error("Category Not Found", { cause: 404 });
    }
    const [rowCount, updatedProducts] = await Product.update(
      { title, price, description, categoryId, stock },
      { where: { id: id }, returning: true },
    );
    if (rowCount === 0) {
      throw new Error("Product not found", { cause: 404 });
    }
    res.json(updatedProducts[0]);
  } catch (err) {
    next(err);
  }
};

/**
 * Deletes a product
 * @param {*} req - the request object
 * @param {*} res - the response object
 * @param {*} next - the next middleware function
 */
export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const product = await Product.findByPk(id);
    if (!product) {
      throw new Error("Product not found", { cause: 404 });
    }
    await product.destroy();
    return res.json({ deletedProduct: product });
  } catch (err) {
    next(err);
  }
};
