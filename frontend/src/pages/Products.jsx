import { useState, useEffect } from 'react';
import { Plus, Search, Edit, Trash2, Package } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ProductForm from '../components/ProductForm';
import { productService } from '../services/productService';
import { useToast } from '../hooks/useToast';
import { CATEGORIES } from '../schemas/productSchemas';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadProducts();
  }, []);

  useEffect(() => {
    filterProducts();
  }, [products, searchTerm, selectedCategory]);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      showError('Erro ao carregar produtos');
    } finally {
      setLoading(false);
    }
  };

  const filterProducts = () => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.barcode.includes(searchTerm)
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  };

  const handleEdit = (product) => {
    console.log('Editando produto:', product);
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este produto?')) {
      try {
        await productService.deleteProduct(id);
        showSuccess('Produto excluído com sucesso');
        loadProducts();
      } catch (error) {
        showError('Erro ao excluir produto');
      }
    }
  };

  const handleFormSubmit = () => {
    setShowForm(false);
    setEditingProduct(null);
    loadProducts();
  };

  const handleNewProduct = () => {
    console.log('Novo produto clicado');
    setEditingProduct(null);
    setShowForm(true);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getCategoryLabel = (category) => {
    const labels = {
      BEBIDAS: 'Bebidas',
      ALIMENTOS: 'Alimentos',
      HIGIENE: 'Higiene',
      LIMPEZA: 'Limpeza',
      OUTROS: 'Outros'
    };
    return labels[category] || category;
  };

  console.log('showForm:', showForm, 'editingProduct:', editingProduct);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between animate-fade-in">
        <h1 className="text-3xl font-bold text-gray-900">Produtos</h1>
        <Button
          onClick={handleNewProduct}
          className="transform transition-all duration-200 hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Produto
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar por nome ou código de barras..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 transition-all duration-200 focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          >
            <option value="">Todas as categorias</option>
            {Object.values(CATEGORIES).map(category => (
              <option key={category} value={category}>
                {getCategoryLabel(category)}
              </option>
            ))}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Produto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Código de Barras
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Categoria
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preço
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estoque
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <Package className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      {searchTerm || selectedCategory ? 'Nenhum produto encontrado' : 'Nenhum produto cadastrado'}
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product.id}
                    className="hover:bg-gray-50 transition-colors duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.barcode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getCategoryLabel(product.category)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.price)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${product.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          className="transform transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          onClick={() => handleDelete(product.id)}
                          className="transform transition-all duration-200 hover:scale-110 active:scale-95"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onClose={() => {
            console.log('Fechando formulário');
            setShowForm(false);
            setEditingProduct(null);
          }}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
};

export default Products; 