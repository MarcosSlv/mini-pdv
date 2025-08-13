import { Router } from 'express';
import { cupomFiscalController } from '../controllers/cupomFiscalController.js';

const router = Router();

router.get('/download/:saleId', cupomFiscalController.generateCupomFiscal);
router.get('/preview/:saleId', cupomFiscalController.previewCupomFiscal);

export default router; 