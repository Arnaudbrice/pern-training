// TODO D1.5: Importiere Product.

import { Op } from "sequelize";
import { Product, Category, User } from "../models/associations.js";
import model from "sequelize/lib/model";

//********** GET /api/products **********

export async function getProducts(req, res, next) {
  try {
    // page minimum 1
    const page = Math.max(1, Math.floor(Number(req.query.page) || 1));
    // limit minimum 1 und maximum 100
    const limit = Math.min(
      100,
      Math.max(1, Math.floor(Number(req.query.limit) || 10)),
    );

    const search = req.query.search?.trim();

    const where = search
      ? {
          title: {
            [Op.iLike]: `%${search}%`,
          },
        }
      : {};
    /*
page 1, offset=0
page 2 , offset=10
page 3, offset= 20
page n, offset=(n-1)*10
*/
    // skips the first n products
    const offset = (page - 1) * limit;

    const products = await Product.findAll({
      where,
      limit,
      offset,
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

    const totalProducts = await Product.count({
      where,
    });

    /* count 23-> total page 3 */
    const totalPages = Math.ceil(totalProducts / limit);

    return res.json({
      products,
      currentPage: page,
      totalProducts,
      totalPages,
    });
  } catch (error) {
    return next(error);
  }
}

//********** GET /api/products/:id **********
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
    return next(error);
  }
}

//********** POST /api/products **********
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
    return next(err);
  }
};

//********** PUT /api/products/:id **********
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
    return res.json(updatedProducts[0]);
  } catch (err) {
    return next(err);
  }
};

//********** DELETE /api/products/:id **********
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
    return next(err);
  }
};

const orders = await Order.findAll({
  include: [{ model: User, as: "user",
     include: [model:Address, as:"defaultAddress"] },{
      model:OrderItem,as:"orderItems",include:[
        {model:Product, as:"product"}
      ]
     }],
  order: [["createdAt", "DESC"]],
});
