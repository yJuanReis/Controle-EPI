
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  Users, 
  FileText, 
  ArrowDownUp, 
  Settings 
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="bg-white rounded-xl shadow-md p-3 mb-8">
      <ul className="flex flex-wrap justify-between">
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/') 
          ? 'bg-primary-50 text-primary-700 font-medium shadow-sm' 
          : 'hover:bg-primary-50 hover:scale-105 transform transition-transform'}`}>
          <Link to="/" className="flex items-center space-x-2">
            <LayoutDashboard className={`${isActive('/') ? 'text-primary-700' : 'text-gray-600'}`} size={18} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/estoque') 
          ? 'bg-primary-50 text-primary-700 font-medium shadow-sm' 
          : 'hover:bg-primary-50 hover:scale-105 transform transition-transform'}`}>
          <Link to="/estoque" className="flex items-center space-x-2">
            <Package className={`${isActive('/estoque') ? 'text-primary-700' : 'text-gray-600'}`} size={18} />
            <span>EPIs</span>
          </Link>
        </li>
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/colaboradores') 
          ? 'bg-primary-50 text-primary-700 font-medium shadow-sm' 
          : 'hover:bg-primary-50 hover:scale-105 transform transition-transform'}`}>
          <Link to="/colaboradores" className="flex items-center space-x-2">
            <Users className={`${isActive('/colaboradores') ? 'text-primary-700' : 'text-gray-600'}`} size={18} />
            <span>Colaboradores</span>
          </Link>
        </li>
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/entregas-devolucoes') 
          ? 'bg-primary-50 text-primary-700 font-medium shadow-sm' 
          : 'hover:bg-primary-50 hover:scale-105 transform transition-transform'}`}>
          <Link to="/entregas-devolucoes" className="flex items-center space-x-2">
            <ArrowDownUp className={`${isActive('/entregas-devolucoes') ? 'text-primary-700' : 'text-gray-600'}`} size={18} />
            <span>Entregas/Devoluções</span>
          </Link>
        </li>
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/relatorios') 
          ? 'bg-primary-50 text-primary-700 font-medium shadow-sm' 
          : 'hover:bg-primary-50 hover:scale-105 transform transition-transform'}`}>
          <Link to="/relatorios" className="flex items-center space-x-2">
            <FileText className={`${isActive('/relatorios') ? 'text-primary-700' : 'text-gray-600'}`} size={18} />
            <span>Relatórios</span>
          </Link>
        </li>
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/gerenciar-usuarios') 
          ? 'bg-primary-50 text-primary-700 font-medium shadow-sm' 
          : 'hover:bg-primary-50 hover:scale-105 transform transition-transform'}`}>
          <Link to="/gerenciar-usuarios" className="flex items-center space-x-2">
            <Settings className={`${isActive('/gerenciar-usuarios') ? 'text-primary-700' : 'text-gray-600'}`} size={18} />
            <span>Configurações</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
