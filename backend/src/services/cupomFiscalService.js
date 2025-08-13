import puppeteer from 'puppeteer';
import { generateCupomFiscalHTML } from '../templates/cupomFiscalTemplate.js';

const establishmentInfo = {
  name: 'LOJA EXEMPLO LTDA',
  cnpj: '00.000.000/0001-00',
  address: 'Rua Exemplo, 123 - Centro',
  city: 'Cidade Exemplo - UF'
};

const generateCupomFiscalPDF = async (saleData) => {
  let browser;

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ]
    });

    const page = await browser.newPage();

    const htmlContent = generateCupomFiscalHTML(saleData, establishmentInfo);

    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0',
      timeout: 30000
    });

    const pdfBuffer = await page.pdf({
      width: '80mm',
      printBackground: true,
      margin: {
        top: '5mm',
        right: '2mm',
        bottom: '5mm',
        left: '2mm'
      },
      format: 'A4'
    });

    return pdfBuffer;

  } catch (error) {
    throw new Error(`Erro ao gerar cupom fiscal PDF: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

const generateCupomFiscalFromSaleId = async (saleId, saleService) => {
  try {
    const saleData = await saleService.getSaleById(saleId);

    if (!saleData) {
      throw new Error('Venda não encontrada');
    }

    const pdfBuffer = await generateCupomFiscalPDF(saleData);

    return {
      filename: `cupom-fiscal-${saleId.toString().padStart(6, '0')}.pdf`,
      buffer: pdfBuffer,
      contentType: 'application/pdf'
    };

  } catch (error) {
    throw error;
  }
};

export const cupomFiscalService = {
  generateCupomFiscalPDF,
  generateCupomFiscalFromSaleId
}; 