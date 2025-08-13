import prisma from '../config/prisma.js';
import { NotFoundError } from '../errors/NotFoundError.js';
import { ConflictError } from '../errors/ConflictError.js';

const adjustStock = async (items, operation = 'subtract', tx = prisma) => {
  const itemsArray = Array.isArray(items) ? items : [items];

  const productIds = itemsArray.map(item => item.productId);

  const products = await tx.product.findMany({
    where: {
      id: { in: productIds },
      isActive: true
    }
  });

  if (products.length !== productIds.length) {
    const foundIds = products.map(p => p.id);
    const missingIds = productIds.filter(id => !foundIds.includes(id));
    throw new NotFoundError(`Produtos não encontrados ou inativos: ${missingIds.join(', ')}`);
  }

  const updates = [];

  for (const item of itemsArray) {
    const product = products.find(p => p.id === item.productId);
    const { quantity } = item;

    let newStock;
    switch (operation) {
      case 'add':
        newStock = product.stock + quantity;
        break;
      case 'subtract':
        newStock = product.stock - quantity;
        break;
      case 'set':
        newStock = quantity;
        break;
      default:
        throw new ConflictError('Operação inválida. Use: add, subtract ou set');
    }

    if (newStock < 0) {
      throw new ConflictError(
        `Estoque inválido para ${product.name}. Disponível: ${product.stock}, Solicitado: ${quantity}`
      );
    }

    updates.push({
      where: { id: item.productId },
      data: { stock: newStock }
    });
  }

  const results = await Promise.all(
    updates.map(update => tx.product.update(update))
  );

  return Array.isArray(items) ? results : results[0];
};

const checkStock = async (productId) => {
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product || !product.isActive) {
    throw new NotFoundError('Produto não encontrado.');
  }

  if (product.stock < 0) {
    throw new ConflictError('Estoque insuficiente.');
  }

  return {
    productId: product.id,
    name: product.name,
    currentStock: product.stock
  };
};

const validadeStock = async (items, tx = prisma) => {
  const barcodes = items.map(item => item.barcode);

  const products = await tx.product.findMany({
    where: {
      barcode: { in: barcodes },
      isActive: true
    }
  });

  const validatedItems = [];

  for (const item of items) {
    const product = products.find(p => p.barcode === item.barcode);

    if (!product) {
      throw new NotFoundError(`Produto com código de barras ${item.barcode} não encontrado ou inativo.`);
    }

    if (product.stock < item.quantity) {
      throw new ConflictError(
        `Estoque insuficiente para ${product.name}. Disponível: ${product.stock}, Solicitado: ${item.quantity}`
      );
    }

    validatedItems.push({
      barcode: item.barcode,
      quantity: item.quantity,
      unitPrice: product.price,
      subtotal: item.quantity * product.price,
      productId: product.id,
      product
    });
  }

  return validatedItems;
};

export const stockService = {
  adjustStock,
  checkStock,
  validadeStock
};
