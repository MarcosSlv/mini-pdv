import { useState, useEffect } from 'react';
import { ShoppingCart, Trash2, Plus, Minus, Search, FileText } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import ProductCard from "../components/ProductCard";
import { productService } from '../services/productService';
import { saleService } from '../services/saleService';
import { cupomFiscalService } from '../services/cupomFiscalService';
import { useToast } from '../hooks/useToast';
import { PAYMENT_METHODS } from '../schemas/saleSchemas';

const PDV = () => {
  const [cart, setCart] = useState([]);
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [barcode, setBarcode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const [lastSaleId, setLastSaleId] = useState(null);
  const [showCupomOptions, setShowCupomOptions] = useState(false);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAllProducts();
      setProducts(data);
    } catch (error) {
      showError('Erro ao carregar produtos');
    }
  };

  const addToCart = async (productObj) => {
    let product;

    if (typeof productObj === 'object') {
      product = productObj;
    } else {
      if (!barcode.trim()) {
        showError('Digite um código de barras');
        return;
      }

      try {
        product = await productService.getProduct(barcode);
        setBarcode('');
      } catch (error) {
        showError('Produto não encontrado');
        return;
      }
    }

    if (product.stock <= 0) {
      showError('Produto sem estoque');
      return;
    }

    const existingItem = cart.find(item => item.barcode === product.barcode);

    if (existingItem) {
      if (existingItem.quantity >= product.stock) {
        showError('Quantidade excede o estoque disponível');
        return;
      }
      updateQuantity(product.barcode, existingItem.quantity + 1);
    } else {
      setCart(prev => [...prev, {
        ...product,
        quantity: 1,
        subtotal: product.price
      }]);
    }

    showSuccess('Produto adicionado ao carrinho');
  };

  const updateQuantity = (barcode, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(barcode);
      return;
    }

    setCart(prev => prev.map(item => {
      if (item.barcode === barcode) {
        const product = products.find(p => p.barcode === barcode);
        if (newQuantity > product.stock) {
          showError('Quantidade excede o estoque disponível');
          return item;
        }
        return {
          ...item,
          quantity: newQuantity,
          subtotal: item.price * newQuantity
        };
      }
      return item;
    }));
  };

  const removeFromCart = (barcode) => {
    setCart(prev => prev.filter(item => item.barcode !== barcode));
  };

  const getTotal = () => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const completeSale = async () => {
    if (cart.length === 0) {
      showError('Carrinho vazio');
      return;
    }

    if (!paymentMethod) {
      showError('Selecione uma forma de pagamento');
      return;
    }

    setLoading(true);
    try {
      const saleData = {
        items: cart.map(item => ({
          barcode: item.barcode,
          quantity: item.quantity
        })),
        paymentMethod
      };

      const response = await saleService.createSale(saleData);
      const saleId = response.data.id;
      setLastSaleId(saleId);
      setShowCupomOptions(true);

      setCart([]);
      setPaymentMethod('');
      showSuccess('Venda realizada com sucesso!');
      loadProducts();
    } catch (error) {
      console.log(error);
      showError(error.response?.data?.message || 'Erro ao processar venda');
    } finally {
      setLoading(false);
    }
  };
  const startNewSale = () => {
    setShowCupomOptions(false);
    setLastSaleId(null);
    setCart([]);
    setPaymentMethod('');
    setBarcode('');
    setSearchTerm('');
    loadProducts();
  };

  const downloadCupomFiscal = async () => {
    try {
      const response = await cupomFiscalService.downloadCupomFiscal(lastSaleId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cupom-fiscal-${lastSaleId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      showError('Erro ao baixar o cupom fiscal');
    }
  };

  const previewCupomFiscal = () => {
    cupomFiscalService.openCupomFiscalInNewTab(lastSaleId);
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.barcode.includes(searchTerm)
  );

  const paymentOptions = Object.values(PAYMENT_METHODS).map(method => ({
    value: method,
    label: {
      DINHEIRO: 'Dinheiro',
      CARTAO_DEBITO: 'Cartão de Débito',
      CARTAO_CREDITO: 'Cartão de Crédito',
      PIX: 'PIX'
    }[method]
  }));

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Ponto de Venda</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="Digite o código de barras"
                value={barcode}
                onChange={(e) => setBarcode(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addToCart()}
              />
            </div>
            <Button onClick={() => addToCart()}>
              Adicionar
            </Button>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar produtos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                onClick={() => addToCart(product)}
                name={product.name}
                price={product.price}
                barcode={product.barcode}
                stock={product.stock}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center mb-4">
            <ShoppingCart className="h-5 w-5 mr-2 text-gray-500" />
            <h2 className="text-lg font-semibold">Carrinho de Compras</h2>
          </div>

          {cart.length === 0 ? (
            <p className="text-gray-500 text-center py-8">Carrinho vazio</p>
          ) : (
            <div className="space-y-4">
              {cart.map(item => (
                <div key={item.barcode} className="flex items-center justify-between border-b pb-3">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <p className="text-xs text-gray-500">{item.barcode}</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {formatCurrency(item.price)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQuantity(item.barcode, item.quantity - 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.barcode, item.quantity + 1)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.barcode)}
                      className="p-1 hover:bg-gray-100 rounded text-red-600"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {showCupomOptions && (
            <div className="mt-6 pt-4 border-t">
              <h3 className="text-lg font-semibold mb-4">Cupom Fiscal</h3>
              <div className="flex flex-col space-y-3">
                <div className="flex justify-center space-x-3">
                  <Button
                    onClick={downloadCupomFiscal}
                    variant="primary"
                    className="flex-1 max-w-xs"
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Baixar Cupom
                  </Button>
                  <Button
                    onClick={previewCupomFiscal}
                    variant="outline"
                    className="flex-1 max-w-xs"
                  >
                    Visualizar
                  </Button>
                </div>
                <Button
                  onClick={startNewSale}
                  variant="success"
                  className="w-full mt-4"
                >
                  Finalizar Venda
                </Button>
              </div>
            </div>
          )}

          {cart.length > 0 && (
            <div className="mt-6 pt-4 border-t">
              <div className="flex justify-between items-center mb-4">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-xl font-bold text-green-600">
                  {formatCurrency(getTotal())}
                </span>
              </div>

              <div className="mb-4">
                <Select
                  label="Forma de Pagamento"
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  options={paymentOptions}
                  placeholder="Selecione..."
                />
              </div>

              <Button
                onClick={completeSale}
                disabled={loading}
                variant="success"
                className="w-full flex justify-center items-center"
              >
                {loading ? 'Processando...' : 'Finalizar Venda'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PDV;