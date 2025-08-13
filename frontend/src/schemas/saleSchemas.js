import { z } from 'zod';

export const PAYMENT_METHODS = {
  DINHEIRO: 'DINHEIRO',
  CARTAO_DEBITO: 'CARTAO_DEBITO',
  CARTAO_CREDITO: 'CARTAO_CREDITO',
  PIX: 'PIX'
};

export const saleItemSchema = z.object({
  barcode: z.string().min(1, 'Código de barras é obrigatório'),
  quantity: z.number()
    .int('Quantidade deve ser um número inteiro')
    .positive('Quantidade deve ser positiva')
});

export const createSaleSchema = z.object({
  items: z.array(saleItemSchema)
    .min(1, 'Adicione pelo menos um produto ao carrinho'),
  paymentMethod: z.enum(Object.values(PAYMENT_METHODS), {
    required_error: 'Forma de pagamento é obrigatória',
    invalid_type_error: 'Forma de pagamento inválida'
  })
}); 