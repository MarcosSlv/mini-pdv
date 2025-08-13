import { z } from 'zod';

export const CATEGORIES = {
  BEBIDAS: 'BEBIDAS',
  ALIMENTOS: 'ALIMENTOS',
  HIGIENE: 'HIGIENE',
  LIMPEZA: 'LIMPEZA',
  OUTROS: 'OUTROS'
};

export const productSchema = z.object({
  name: z.string()
    .min(1, 'Nome é obrigatório')
    .min(2, 'Nome deve ter pelo menos 2 caracteres'),
  price: z.number()
    .min(0, 'Preço deve ser maior ou igual a zero')
    .multipleOf(0.01, 'Preço deve ter no máximo 2 casas decimais'),
  barcode: z.string()
    .min(1, 'Código de barras é obrigatório')
    .min(3, 'Código de barras deve ter pelo menos 3 caracteres'),
  stock: z.number()
    .int('Estoque deve ser um número inteiro')
    .min(0, 'Estoque deve ser maior ou igual a zero'),
  category: z.enum(Object.values(CATEGORIES), {
    required_error: 'Categoria é obrigatória',
    invalid_type_error: 'Categoria inválida'
  })
}); 