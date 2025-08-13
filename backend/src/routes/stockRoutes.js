import { Router } from "express";
import { stockController } from '../controllers/stockController.js';

const stockRouter = Router();

stockRouter.patch('/:productId', stockController.updateStock);
stockRouter.get('/:productId', stockController.checkStock);
stockRouter.get('/low', stockController.listLowStock);
stockRouter.post('/adjust', stockController.adjustStock);

export default stockRouter;