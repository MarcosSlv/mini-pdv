import { Router } from "express";
import { saleController } from '../controllers/saleController.js';

const saleRouter = Router();

saleRouter.post('/', saleController.createSale);
saleRouter.get('/', saleController.listSales);
saleRouter.get('/:id', saleController.getSaleById);

export default saleRouter;