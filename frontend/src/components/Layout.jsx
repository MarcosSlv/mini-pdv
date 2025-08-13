import { Link, useLocation } from 'react-router-dom';
import {
  ShoppingCart,
  Package,
  BarChart3,
  Home,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const Layout = ({ children }) => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/', icon: Home },
    { name: 'Produtos', href: '/products', icon: Package },
    { name: 'PDV', href: '/pdv', icon: ShoppingCart },
    { name: 'Relatórios', href: '/reports', icon: BarChart3 },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen overflow-hidden">
        <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}>
          <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
            <h1 className="text-xl font-bold text-gray-900">PDV System</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-md hover:bg-gray-100"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <nav className="mt-8 px-6">
            <ul className="space-y-2">
              {navigation.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${isActive(item.href)
                        ? 'bg-blue-50 text-blue-700'
                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      }`}
                    onClick={() => setSidebarOpen(false)}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <header className="bg-white shadow-sm border-b border-gray-200 lg:hidden">
            <div className="flex items-center justify-between h-16 px-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <Menu className="h-6 w-6" />
              </button>
              <h1 className="text-lg font-semibold text-gray-900">PDV System</h1>
              <div className="w-10"></div>
            </div>
          </header>

          <main className="flex-1 overflow-auto p-6">
            {children}
          </main>
        </div>
      </div>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden bg-gray-600 bg-opacity-75"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default Layout; 