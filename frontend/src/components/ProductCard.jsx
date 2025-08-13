const ProductCard = ({ id, onClick, name, price, barcode, stock }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <div
      className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <h3 className="font-medium text-gray-900 mb-2">{name}</h3>
      <p className="text-sm text-gray-500 mb-1">Código: {barcode}</p>
      <p className="text-lg font-bold text-blue-600">{formatCurrency(price)}</p>
      <p className={`text-sm ${stock <= 5 ? 'text-red-600' : 'text-green-600'}`}>
        Estoque: {stock}
      </p>
    </div>
  );
};

export default ProductCard;