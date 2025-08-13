import { cupomFiscalService } from '../services/cupomFiscalService.js';
import { saleService } from '../services/saleService.js';
import { BadRequestError } from '../errors/BadRequestError.js';
import { NotFoundError } from '../errors/NotFoundError.js';

const generateCupomFiscal = async (req, res) => {
  try {
    const saleId = parseInt(req.params.saleId);

    if (!saleId || isNaN(saleId)) {
      throw new BadRequestError('ID da venda inválido');
    }

    const result = await cupomFiscalService.generateCupomFiscalFromSaleId(saleId, saleService);

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.setHeader('Content-Length', result.buffer.length);

    res.send(result.buffer);
  } catch (error) {
    if (error.message === 'Venda não encontrada') {
      throw new NotFoundError(error.message);
    }
    throw error;
  }
};

const previewCupomFiscal = async (req, res) => {
  try {
    const saleId = parseInt(req.params.saleId);

    if (!saleId || isNaN(saleId)) {
      throw new BadRequestError('ID da venda inválido');
    }

    const result = await cupomFiscalService.generateCupomFiscalFromSaleId(saleId, saleService);

    res.setHeader('Content-Type', result.contentType);
    res.setHeader('Content-Disposition', `inline; filename="${result.filename}"`);
    res.setHeader('Content-Length', result.buffer.length);

    res.send(result.buffer);
  } catch (error) {
    if (error.message === 'Venda não encontrada') {
      throw new NotFoundError(error.message);
    }
    throw error;
  }
};

export const cupomFiscalController = {
  generateCupomFiscal,
  previewCupomFiscal
}; 