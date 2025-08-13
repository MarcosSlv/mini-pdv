import { Router } from "express";
import { productController } from "../controllers/productController.js";

const productRouter = Router();

productRouter.post("/", productController.createProduct);
productRouter.get("/", productController.getAllProducts);
productRouter.get("/search", productController.searchProducts);
productRouter.get("/:barcode", productController.getProduct);
productRouter.get("/category/:category", productController.getProductsByCategory);
productRouter.put("/:id", productController.updateProduct);
productRouter.delete("/:id", productController.deleteProduct);
productRouter.patch("/:id/activate", productController.activateProduct);

export default productRouter;