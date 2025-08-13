import { z } from 'zod';
import { categorySchema } from "./category.schema.js";

export const productSchema = z.object({
  name: z.string().min(1),
  price: z.number().min(0),
  barcode: z.string().min(1),
  stock: z.number().min(0),
  category: categorySchema.shape.category
});