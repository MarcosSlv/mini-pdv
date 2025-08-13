import api from './api';

export const saleService = {
  async createSale(saleData) {
    const response = await api.post('/sales', saleData);
    return response.data;
  },

  async listSales(filters = {}) {
    const response = await api.get('/sales', { params: filters });
    console.log(response.data);
    return response.data;
  },

  async getSaleById(id) {
    const response = await api.get(`/sales/${id}`);
    return response.data;
  },
}; 