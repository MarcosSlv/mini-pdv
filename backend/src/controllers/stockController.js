import { stockService } from '../services/stockService.js';

const updateStock = async (req, res, next) => {
  const { productId } = req.params;
  const { quantity, operation } = req.body;

  if (!quantity || quantity <= 0) {
    return res.status(400).json({ error: 'Quantidade inválida' });
  }

  try {
    const result = await stockService.updateStock(Number(productId), quantity, operation);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const checkStock = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const stock = await stockService.checkStock(Number(productId));
    res.status(200).json(stock);
  } catch (error) {
    next(error);
  }
};

const listLowStock = async (req, res, next) => {
  const { threshold } = req.query;

  try {
    const products = await stockService.listLowStock(Number(threshold));
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const adjustStock = async (req, res, next) => {
  const { adjustments } = req.body;

  if (!adjustments?.length) {
    return res.status(400).json({ error: 'Ajustes são obrigatórios' });
  }

  try {
    const results = await stockService.adjustStock(adjustments);
    res.status(200).json(results);
  } catch (error) {
    next(error);
  }
};

export const stockController = {
  updateStock,
  checkStock,
  listLowStock,
  adjustStock
};