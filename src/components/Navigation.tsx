
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
    <nav className="bg-white rounded-lg shadow-md p-4 mb-8">
      <ul className="flex flex-wrap justify-between">
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/') ? 'bg-primary-50 text-primary-700' : 'hover:bg-primary-50'}`}>
          <Link to="/" className="flex items-center">
            <LayoutDashboard className="mr-2" size={18} />
            <span>Dashboard</span>
          </Link>
        </li>
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/estoque') ? 'bg-primary-50 text-primary-700' : 'hover:bg-primary-50'}`}>
          <Link to="/estoque" className="flex items-center">
            <Package className="mr-2" size={18} />
            <span>EPIs</span>
          </Link>
        </li>
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/colaboradores') ? 'bg-primary-50 text-primary-700' : 'hover:bg-primary-50'}`}>
          <Link to="/colaboradores" className="flex items-center">
            <Users className="mr-2" size={18} />
            <span>Colaboradores</span>
          </Link>
        </li>
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/entregas-devolucoes') ? 'bg-primary-50 text-primary-700' : 'hover:bg-primary-50'}`}>
          <Link to="/entregas-devolucoes" className="flex items-center">
            <ArrowDownUp className="mr-2" size={18} />
            <span>Entregas/Devoluções</span>
          </Link>
        </li>
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/relatorios') ? 'bg-primary-50 text-primary-700' : 'hover:bg-primary-50'}`}>
          <Link to="/relatorios" className="flex items-center">
            <FileText className="mr-2" size={18} />
            <span>Relatórios</span>
          </Link>
        </li>
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/gerenciar-usuarios') ? 'bg-primary-50 text-primary-700' : 'hover:bg-primary-50'}`}>
          <Link to="/gerenciar-usuarios" className="flex items-center">
            <Settings className="mr-2" size={18} />
            <span>Configurações</span>
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
