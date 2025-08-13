import { useState, useEffect } from 'react';
import { BarChart3, Package, ShoppingCart, TrendingUp } from 'lucide-react';
import { saleService } from '../services/saleService';
import { productService } from '../services/productService';

const Dashboard = () => {
  const [metrics, setMetrics] = useState({
    totalProducts: 0,
    todaySales: 0,
    todayRevenue: 0,
    lowStockProducts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const products = await productService.getAllProducts();
        const dailySales = await saleService.listSales();

        const lowStock = products.filter(product => product.stock <= 5).length;

        setMetrics({
          totalProducts: products.length,
          todaySales: dailySales.data?.total || 0,
          todayRevenue: dailySales.data?.totalRevenue || 0,
          lowStockProducts: lowStock
        });
      } catch (error) {
        console.error('Erro ao carregar métricas:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMetrics();
  }, []);

  const cards = [
    {
      title: 'Total de Produtos',
      value: metrics.totalProducts,
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Vendas Hoje',
      value: metrics.todaySales,
      icon: ShoppingCart,
      color: 'bg-green-500'
    },
    {
      title: 'Faturamento Hoje',
      value: `R$ ${metrics.todayRevenue.toFixed(2)}`,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Estoque Baixo',
      value: metrics.lowStockProducts,
      icon: BarChart3,
      color: 'bg-red-500'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className={`${card.color} rounded-lg p-3 mr-4`}>
                <card.icon className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">{card.title}</p>
                <p className="text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Bem-vindo ao Sistema PDV</h2>
        <p className="text-gray-600">
          Gerencie seus produtos, realize vendas e acompanhe o desempenho do seu negócio
          através do painel de controle.
        </p>
      </div>
    </div>
  );
};

export default Dashboard; 