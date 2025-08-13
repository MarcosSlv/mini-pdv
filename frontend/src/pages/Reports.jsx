import { useState, useEffect } from 'react';
import { Calendar, FileText, TrendingUp, Download } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { saleService } from '../services/saleService';
import { cupomFiscalService } from '../services/cupomFiscalService';
import { useToast } from '../hooks/useToast';
import { PAYMENT_METHODS } from '../schemas/saleSchemas';

const Reports = () => {
  const [sales, setSales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [filters, setFilters] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0],
    paymentMethod: ''
  });
  const [loading, setLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    loadSales();
  }, []);

  const loadSales = async () => {
    setLoading(true);
    try {
      const response = await saleService.listSales(filters);
      setSales(response.data.sales || []);
      setTotalSales(response.data.total || 0);
      setTotalRevenue(response.data.totalRevenue || 0);
    } catch (error) {
      console.log(error);
      if (error.response?.data?.message) {
        showError(error.response.data.message);
      }
      setSales([]);
      setTotalSales(0);
      setTotalRevenue(0);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const applyFilters = () => {
    loadSales();
  };

  const clearFilters = () => {
    setFilters({
      startDate: '',
      endDate: '',
      paymentMethod: ''
    });
    setTimeout(() => loadSales(), 100);
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getPaymentMethodLabel = (method) => {
    const labels = {
      DINHEIRO: 'Dinheiro',
      CARTAO_DEBITO: 'Cartão de Débito',
      CARTAO_CREDITO: 'Cartão de Crédito',
      PIX: 'PIX'
    };
    return labels[method] || method;
  };

  const paymentOptions = Object.values(PAYMENT_METHODS).map(method => ({
    value: method,
    label: getPaymentMethodLabel(method)
  }));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const downloadCupomFiscal = async (saleId) => {
    try {
      const response = await cupomFiscalService.downloadCupomFiscal(saleId);
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `cupom-fiscal-${saleId}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showSuccess('Cupom fiscal baixado com sucesso!');
    } catch (error) {
      showError('Erro ao baixar o cupom fiscal');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Relatórios de Vendas</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-blue-500 rounded-lg p-3 mr-4">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Vendas</p>
              <p className="text-2xl font-bold text-gray-900">{totalSales}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-green-500 rounded-lg p-3 mr-4">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Faturamento Total</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(totalRevenue)}</p>
            </div>
          </div>
        </div>


        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="bg-purple-500 rounded-lg p-3 mr-4">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ticket Médio</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalSales > 0 ? formatCurrency(totalRevenue / totalSales) : 'R$ 0,00'}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Filtros</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Input
            label="Data Início"
            type="date"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
          />

          <Input
            label="Data Fim"
            type="date"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
          />

          <Select
            label="Forma de Pagamento"
            value={filters.paymentMethod}
            onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
            options={paymentOptions}
            placeholder="Todas"
          />

          <div className="flex items-end space-x-2">
            <Button onClick={applyFilters}>
              Aplicar Filtros
            </Button>
            <Button variant="secondary" onClick={clearFilters}>
              Limpar
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Data/Hora
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Forma de Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Itens
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sales.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <FileText className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-sm text-gray-500">
                      Nenhuma venda encontrada
                    </p>
                  </td>
                </tr>
              ) : (
                sales.map((sale) => (
                  <tr key={sale.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{sale.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(sale.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                        {getPaymentMethodLabel(sale.paymentMethod)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {sale.items?.length || 0} item(s)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                      {formatCurrency(sale.total)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => downloadCupomFiscal(sale.id)}
                        title="Baixar Cupom Fiscal"
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;