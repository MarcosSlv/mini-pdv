import { z } from 'zod';

export const categorySchema = z.object({
  category: z.enum(["BEBIDAS", "ALIMENTOS", "HIGIENE", "LIMPEZA", "OUTROS"]),
});