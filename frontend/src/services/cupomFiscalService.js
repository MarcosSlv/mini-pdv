import api from './api';

export const cupomFiscalService = {
  async downloadCupomFiscal(saleId) {
    return api.get(`/cupom-fiscal/download/${saleId}`, {
      responseType: 'blob'
    });
  },

  async previewCupomFiscal(saleId) {
    return api.get(`/cupom-fiscal/preview/${saleId}`, {
      responseType: 'blob'
    });
  },

  openCupomFiscalInNewTab(saleId) {
    const url = `${api.defaults.baseURL}/cupom-fiscal/preview/${saleId}`;
    window.open(url, '_blank');
  }
};