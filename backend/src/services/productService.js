import prisma from "../config/prisma.js";

import { ConflictError } from "../errors/ConflictError.js";
import { NotFoundError } from "../errors/NotFoundError.js";

const createProduct = async ({ name, price, barcode, stock, category }) => {

  console.log(name, price, barcode, stock, category);

  const product = await prisma.product.findUnique({
    where: {
      barcode: barcode
    }
  });

  if (product) {
    console.log(product);
    throw new ConflictError("Produto já cadastrado.");
  }

  const newProduct = await prisma.product.create({
    data: {
      name,
      price,
      barcode,
      stock,
      category
    }
  });

  console.log(newProduct);

  return newProduct;
};

const getAllProducts = async () => {
  const products = await prisma.product.findMany({
    where: {
      isActive: true
    }
  });

  return products;
};

const getProductByBarcode = async (barcode) => {
  const product = await prisma.product.findUnique({
    where: {
      barcode
    }
  });

  if (!product || !product.isActive) {
    throw new NotFoundError("Produto não encontrado.");
  }

  return product;
};

const getProductsByCategoryOrName = async (category, name) => {
  console.log(category, name);

  const whereConditions = {
    isActive: true
  };

  if (category) {
    whereConditions.category = category;
  }

  if (name) {
    whereConditions.name = {
      contains: name,
      mode: 'insensitive'
    };
  }

  const products = await prisma.product.findMany({
    where: whereConditions
  });

  if (!products || products.length === 0) {
    throw new NotFoundError("Nenhum produto encontrado.");
  }

  return products;
};

const updateProduct = async (id, { name, price, barcode, stock, category }) => {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(id)
    }
  });

  if (!product) {
    throw new NotFoundError("Produto não encontrado.");
  }

  const updatedProduct = await prisma.product.update({
    where: {
      id: parseInt(id)
    },
    data: {
      name,
      price,
      barcode,
      stock,
      category
    }
  });

  return updatedProduct;

};

const deleteProduct = async (id) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id)
    }
  });

  if (!product || !product.isActive) {
    throw new NotFoundError("Produto não encontrado.");
  }


  await prisma.product.update({
    where: {
      id: Number(id)
    },
    data: {
      isActive: false
    }
  });

  return true;
};

const activateProduct = async (id) => {
  const product = await prisma.product.findUnique({
    where: {
      id: Number(id)
    }
  });

  if (!product) {
    throw new NotFoundError("Produto não encontrado.");
  }

  await prisma.product.update({
    where: {
      id: Number(id)
    },
    data: {
      isActive: true
    }
  });

  return true;
};

const getProductById = async (id) => {
  const product = await prisma.product.findUnique({
    where: {
      id: parseInt(id)
    }
  });

  if (!product || !product.isActive) {
    throw new NotFoundError("Produto não encontrado.");
  }

  return product;
};

export const productService = {
  createProduct,
  getAllProducts,
  getProductById,
  getProductByBarcode,
  getProductsByCategoryOrName,
  updateProduct,
  deleteProduct,
  activateProduct
};