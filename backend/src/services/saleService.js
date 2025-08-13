import prisma from '../config/prisma.js';
import { NotFoundError } from "../errors/NotFoundError.js";
import { stockService } from './stockService.js';

const createSale = async (items, paymentMethod) => {
  return await prisma.$transaction(async (tx) => {
    const validatedItems = await stockService.validadeStock(items, tx);

    const stockUpdates = validatedItems.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }));

    await stockService.adjustStock(stockUpdates, 'subtract', tx);

    const total = validatedItems.reduce((sum, item) => sum + item.subtotal, 0);

    const newSale = await tx.sale.create({
      data: {
        total: parseFloat(total.toFixed(2)),
        paymentMethod,
        items: {
          create: validatedItems.map(item => ({
            productId: item.productId,
            barcode: item.barcode,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal
          }))
        }
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                barcode: true,
                name: true
              }
            }
          }
        }
      }
    });

    const saleData = {
      id: newSale.id,
      total: newSale.total,
      totalItems: newSale.items.length,
      paymentMethod: newSale.paymentMethod,
      createdAt: newSale.createdAt,
      items: newSale.items.map(item => ({
        barcode: item.product.barcode,
        product: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      }))
    };

    return saleData;
  }, {
    timeout: 10000
  });
};

const listSales = async (filters = {}) => {
  const { startDate, endDate, paymentMethod, page = 1, limit = 10 } = filters;

  console.log(filters);

  const today = new Date();
  const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);


  const whereClause = {
    createdAt: {
      gte: startDate ? new Date(startDate + 'T00:00:00.000Z') : startOfDay,
      lte: endDate ? new Date(endDate + 'T23:59:59.999Z') : endOfDay
    }
  };

  if (paymentMethod) {
    whereClause.paymentMethod = paymentMethod;
  }

  console.log(whereClause);

  const [sales, total] = await Promise.all([
    prisma.sale.findMany({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    }),
    prisma.sale.count({ where: whereClause })
  ]);

  console.log(sales);

  return {
    sales: sales.map(sale => ({
      id: sale.id,
      total: sale.total,
      paymentMethod: sale.paymentMethod,
      createdAt: sale.createdAt,
      totalItems: sale.items.length,
      items: sale.items.map(item => ({
        productId: item.product.id,
        barcode: item.barcode,
        product: item.product.name,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        subtotal: item.subtotal
      }))
    })),
    total,
    page,
    limit,
    totalRevenue: sales.reduce((sum, sale) => sum + sale.total, 0),
    totalPages: Math.ceil(total / limit)
  };
};

const getSaleById = async (id) => {
  const sale = await prisma.sale.findFirst({
    where: { id: parseInt(id) },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  });

  if (!sale) {
    throw new NotFoundError('Venda não encontrada.');
  }

  return {
    id: sale.id,
    total: sale.total,
    paymentMethod: sale.paymentMethod,
    createdAt: sale.createdAt,
    totalItems: sale.items.length,
    items: sale.items.map(item => ({
      productId: item.product.id,
      barcode: item.barcode,
      product: item.product.name,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal
    }))
  };
};


export const saleService = {
  createSale,
  listSales,
  getSaleById,
};
