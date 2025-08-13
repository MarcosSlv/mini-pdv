import api from './api';

export const productService = {
  async getAllProducts() {
    const response = await api.get('/product');
    return response.data;
  },

  async getProduct(barcode) {
    const response = await api.get(`/product/${barcode}`);
    return response.data;
  },

  async createProduct(productData) {
    const response = await api.post('/product', productData);
    return response.data;
  },

  async updateProduct(id, productData) {
    const response = await api.put(`/product/${id}`, productData);
    return response.data;
  },

  async deleteProduct(id) {
    const response = await api.delete(`/product/${id}`);
    return response.data;
  },

  async getProductsByCategory(category) {
    const response = await api.get(`/product/category/${category}`);
    return response.data;
  },

  async searchProducts(params) {
    const response = await api.get('/product/search', { params });
    return response.data;
  }
}; 