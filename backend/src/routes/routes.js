import { Router } from "express";
import productRouter from "./productRoutes.js";
import saleRouter from './saleRoutes.js';
import stockRouter from './stockRoutes.js';
import cupomFiscalRouter from './cupomFiscalRoutes.js';

const router = Router();

router.use("/product", productRouter);
router.use('/sales', saleRouter);
router.use('/stock', stockRouter);
router.use('/cupom-fiscal', cupomFiscalRouter);

export default router;