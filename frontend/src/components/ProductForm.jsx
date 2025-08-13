import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { CATEGORIES } from '../schemas/productSchemas';
import { productService } from '../services/productService';
import { useToast } from '../hooks/useToast';

const ProductForm = ({ product, onClose, onSubmit }) => {
  const { showSuccess, showError } = useToast();
  const isEditing = !!product;

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    barcode: '',
    stock: '',
    category: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  console.log('ProductForm renderizado - isEditing:', isEditing);

  useEffect(() => {
    setIsVisible(true);

    if (product) {
      setFormData({
        name: product.name || '',
        price: product.price || '',
        barcode: product.barcode || '',
        stock: product.stock || '',
        category: product.category || ''
      });
    }
  }, [product]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (!formData.barcode.trim()) {
      newErrors.barcode = 'Código de barras é obrigatório';
    }
    if (!formData.price || parseFloat(formData.price) < 0) {
      newErrors.price = 'Preço deve ser maior ou igual a zero';
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      newErrors.stock = 'Estoque deve ser maior ou igual a zero';
    }
    if (!formData.category) {
      newErrors.category = 'Categoria é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submitData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        barcode: formData.barcode.trim(),
        stock: parseInt(formData.stock),
        category: formData.category
      };

      if (isEditing) {
        await productService.updateProduct(product.id, submitData);
        showSuccess('Produto atualizado com sucesso');
      } else {
        await productService.createProduct(submitData);
        showSuccess('Produto criado com sucesso');
      }

      setIsVisible(false);
      setTimeout(() => {
        onSubmit();
      }, 300);
    } catch (error) {
      showError(error.response?.data?.message || 'Erro ao salvar produto');
    } finally {
      setIsSubmitting(false);
    }
  };

  const categoryOptions = Object.values(CATEGORIES).map(category => ({
    value: category,
    label: {
      BEBIDAS: 'Bebidas',
      ALIMENTOS: 'Alimentos',
      HIGIENE: 'Higiene',
      LIMPEZA: 'Limpeza',
      OUTROS: 'Outros'
    }[category]
  }));

  return (
    <div
      className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 transition-all duration-300 ease-out ${isVisible
        ? 'bg-opacity-50 backdrop-blur-sm'
        : 'bg-opacity-0 backdrop-blur-none'
        }`}
      style={{ zIndex: 9999 }}
    >
      <div
        className={`bg-white rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto transition-all duration-300 ease-out transform ${isVisible
          ? 'scale-100 opacity-100 translate-y-0'
          : 'scale-95 opacity-0 translate-y-4'
          }`}
      >
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Editar Produto' : 'Novo Produto'}
            </h2>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors duration-200"
              type="button"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="transform transition-all duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome do Produto
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Digite o nome do produto"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1 animate-fade-in">{errors.name}</p>
              )}
            </div>

            <div className="transform transition-all duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de Barras
              </label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => handleChange('barcode', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Digite o código de barras"
              />
              {errors.barcode && (
                <p className="text-sm text-red-600 mt-1 animate-fade-in">{errors.barcode}</p>
              )}
            </div>

            <div className="transform transition-all duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Preço
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="text-sm text-red-600 mt-1 animate-fade-in">{errors.price}</p>
              )}
            </div>

            <div className="transform transition-all duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estoque
              </label>
              <input
                type="number"
                value={formData.stock}
                onChange={(e) => handleChange('stock', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="0"
              />
              {errors.stock && (
                <p className="text-sm text-red-600 mt-1 animate-fade-in">{errors.stock}</p>
              )}
            </div>

            <div className="transform transition-all duration-200">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Categoria
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              >
                <option value="">Selecione uma categoria</option>
                {categoryOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              {errors.category && (
                <p className="text-sm text-red-600 mt-1 animate-fade-in">{errors.category}</p>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-200 transform hover:scale-105"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100"
              >
                {isSubmitting ? 'Salvando...' : isEditing ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProductForm; 