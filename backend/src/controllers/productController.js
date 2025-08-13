import { productService } from '../services/productService.js';

import { ConflictError } from '../errors/ConflictError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

import { productSchema } from '../schemas/product.schema.js';
import { categorySchema } from '../schemas/category.schema.js';

const createProduct = async (req, res, next) => {
  console.log(req.body);

  const { success, data, error } = productSchema.safeParse(req.body);

  console.log(success, data, error);


  if (!success) {
    throw new ConflictError("Algum campo está inválido.");
  }

  const { name, price, barcode, stock, category } = data;

  console.log(data);
  try {
    const product = await productService.createProduct({ name, price, barcode, stock, category });
    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
};

const getAllProducts = async (req, res, next) => {
  try {
    const products = await productService.getAllProducts();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};
const getProduct = async (req, res, next) => {
  const { barcode } = req.params;

  console.log(barcode);


  try {
    const product = await productService.getProductByBarcode(barcode);
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const getProductsByCategory = async (req, res, next) => {
  const { category } = req.params;

  const { success, data, error } = categorySchema.safeParse({ category: category.toUpperCase() });

  if (!success) {
    throw new NotFoundError("Categoria não encontrada.");
  }

  try {
    const products = await productService.getProductsByCategoryOrName(data.category);
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const searchProducts = async (req, res, next) => {
  const { name, category } = req.query;

  if (!name && !category) {
    throw new ConflictError("Informe o nome do produto ou a categoria para buscar.");
  }

  try {
    const products = await productService.getProductsByCategoryOrName(
      category ? category.toUpperCase() : null,
      name || null
    );
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const { name, price, barcode, stock, category } = req.body;

  try {
    const product = await productService.updateProduct(id, { name, price, barcode, stock, category });
    res.status(200).json(product);
  } catch (error) {
    next(error);
  }
};

const deleteProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    await productService.deleteProduct(id);
    res.status(200).json({ message: "Produto desativado com sucesso." });
  } catch (error) {
    next(error);
  }
};

const activateProduct = async (req, res, next) => {
  const { id } = req.params;

  try {
    await productService.activateProduct(id);
    res.status(200).json({ message: "Produto ativado com sucesso." });
  } catch (error) {
    next(error);
  }
};

export const productController = {
  createProduct,
  getAllProducts,
  getProduct,
  getProductsByCategory,
  searchProducts,
  updateProduct,
  deleteProduct,
  activateProduct
};