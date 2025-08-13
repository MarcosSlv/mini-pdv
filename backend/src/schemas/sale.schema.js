import { z } from 'zod';

export const saleItemSchema = z.object({
  barcode: z.string().min(1, 'Código de barras é obrigatório'),
  quantity: z.number().int().positive('Quantidade deve ser positiva')
});

export const createSaleSchema = z.object({
  items: z.array(saleItemSchema).min(1, 'Sem produtos no carrinho'),
  paymentMethod: z.enum(['DINHEIRO', 'CARTAO_DEBITO', 'CARTAO_CREDITO', 'PIX'], {
    required_error: 'Forma de pagamento é obrigatória',
    invalid_type_error: 'Forma de pagamento inválida'
  })
});

export const saleFiltersSchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  paymentMethod: z.enum(['DINHEIRO', 'CARTAO_DEBITO', 'CARTAO_CREDITO', 'PIX', '']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10)
}); 