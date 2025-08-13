import { saleService } from '../services/saleService.js';
import { createSaleSchema, saleFiltersSchema } from '../schemas/sale.schema.js';

const createSale = async (req, res, next) => {
  try {
    const validatedData = createSaleSchema.parse(req.body);

    const sale = await saleService.createSale(
      validatedData.items,
      validatedData.paymentMethod
    );

    res.status(201).json({
      success: true,
      message: 'Venda criada com sucesso',
      data: sale
    });
  } catch (error) {
    next(error);
  }
};

const listSales = async (req, res, next) => {
  try {
    const validatedFilters = saleFiltersSchema.parse(req.query);

    const result = await saleService.listSales(validatedFilters);

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    next(error);
  }
};

const getSaleById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sale = await saleService.getSaleById(id);

    res.status(200).json({
      success: true,
      data: sale
    });
  } catch (error) {
    next(error);
  }
};

export const saleController = {
  createSale,
  listSales,
  getSaleById
};