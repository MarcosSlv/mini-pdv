export const generateCupomFiscalHTML = (saleData, establishmentInfo) => {
  const { name: establishmentName } = establishmentInfo;
  const { id, total, paymentMethod, createdAt, items } = saleData;

  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0);
  const discount = 0;
  const finalTotal = subtotal - discount;

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }).format(new Date(date));
  };

  const paymentMethodMap = {
    'DINHEIRO': 'Dinheiro',
    'CARTAO_DEBITO': 'Cartão de Débito',
    'CARTAO_CREDITO': 'Cartão de Crédito',
    'PIX': 'PIX'
  };

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cupom Fiscal - ${id}</title>
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          line-height: 1.4;
          color: #000;
          width: 80mm;
          margin: 0 auto;
          padding: 10px;
        }
        
        .header {
          text-align: center;
          border-bottom: 2px solid #000;
          padding-bottom: 10px;
          margin-bottom: 15px;
        }
        
        .establishment-name {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 5px;
          text-transform: uppercase;
        }
        
        .cupom-title {
          font-size: 14px;
          font-weight: bold;
          margin-top: 10px;
        }
        
        .sale-info {
          margin-bottom: 15px;
          text-align: center;
        }
        
        .sale-number {
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .date-time {
          font-size: 11px;
        }
        
        .items-section {
          border-top: 1px dashed #000;
          border-bottom: 1px dashed #000;
          padding: 10px 0;
          margin-bottom: 15px;
        }
        
        .items-header {
          font-weight: bold;
          margin-bottom: 8px;
          text-align: center;
        }
        
        .item {
          margin-bottom: 8px;
          padding-bottom: 5px;
        }
        
        .item-name {
          font-weight: bold;
          margin-bottom: 2px;
        }
        
        .item-details {
          display: flex;
          justify-content: space-between;
          font-size: 11px;
        }
        
        .item-qty-price {
          flex: 1;
        }
        
        .item-subtotal {
          font-weight: bold;
        }
        
        .totals-section {
          margin-bottom: 15px;
        }
        
        .total-line {
          display: flex;
          justify-content: space-between;
          margin-bottom: 3px;
        }
        
        .total-line.final {
          font-weight: bold;
          font-size: 14px;
          border-top: 1px solid #000;
          padding-top: 5px;
          margin-top: 8px;
        }
        
        .payment-section {
          border-top: 1px dashed #000;
          padding-top: 10px;
          margin-bottom: 15px;
        }
        
        .payment-method {
          text-align: center;
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .footer {
          text-align: center;
          border-top: 2px solid #000;
          padding-top: 10px;
          font-size: 10px;
        }
        
        .thanks-message {
          font-weight: bold;
          margin-bottom: 5px;
        }
        
        .separator {
          text-align: center;
          margin: 10px 0;
          font-size: 14px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="establishment-name">${establishmentName}</div>
        <div class="cupom-title">CUPOM FISCAL</div>
      </div>
      
      <div class="sale-info">
        <div class="sale-number">Venda Nº: ${id.toString().padStart(6, '0')}</div>
        <div class="date-time">${formatDate(createdAt)}</div>
      </div>
      
      <div class="items-section">
        <div class="items-header">ITENS COMPRADOS</div>
        <div class="separator">============================</div>
        ${items.map(item => `
          <div class="item">
            <div class="item-name">${item.product}</div>
            <div class="item-details">
              <div class="item-qty-price">
                ${item.quantity}x ${formatCurrency(item.unitPrice)}
              </div>
              <div class="item-subtotal">${formatCurrency(item.subtotal)}</div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="totals-section">
        <div class="total-line">
          <span>Subtotal:</span>
          <span>${formatCurrency(subtotal)}</span>
        </div>
        ${discount > 0 ? `
          <div class="total-line">
            <span>Desconto:</span>
            <span>-${formatCurrency(discount)}</span>
          </div>
        ` : ''}
        <div class="total-line final">
          <span>TOTAL:</span>
          <span>${formatCurrency(finalTotal)}</span>
        </div>
      </div>
      
      <div class="payment-section">
        <div class="payment-method">Forma de Pagamento:</div>
        <div style="text-align: center; font-size: 13px;">
          ${paymentMethodMap[paymentMethod] || paymentMethod}
        </div>
      </div>
      
      <div class="footer">
        <div class="thanks-message">OBRIGADO PELA PREFERÊNCIA!</div>
        <div>Volte sempre!</div>
      </div>
    </body>
    </html>
  `;
}; 