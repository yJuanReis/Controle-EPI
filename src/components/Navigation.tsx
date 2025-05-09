
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path: string) => currentPath === path;

  return (
    <nav className="bg-white rounded-lg shadow-md p-4 mb-8">
      <ul className="flex flex-wrap justify-between">
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/') ? 'bg-primary-50 text-primary-700' : 'hover:bg-primary-50'}`}>
          <Link to="/" className="flex items-center">
            <span className="material-symbols-outlined mr-2">dashboard</span>
            <span>Dashboard</span>
          </Link>
        </li>
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/estoque') ? 'bg-primary-50 text-primary-700' : 'hover:bg-primary-50'}`}>
          <Link to="/estoque" className="flex items-center">
            <span className="material-symbols-outlined mr-2">shield</span>
            <span>EPIs</span>
          </Link>
        </li>
        <li className={`px-4 py-2 rounded-lg transition-colors cursor-pointer flex items-center ${isActive('/colaboradores') ? 'bg-primary-50 text-primary-700' : 'hover:bg-primary-50'}`}>
          <Link to="/colaboradores" className="flex items-center">
            <span className="material-symbols-outlined mr-2">people</span>
            <span>Colaboradores</span>
          </Link>
        </li>
        <li className="px-4 py-2 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer flex items-center">
          <span className="material-symbols-outlined mr-2">swap_horiz</span>
          <span>Entregas/Devoluções</span>
        </li>
        <li className="px-4 py-2 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer flex items-center">
          <span className="material-symbols-outlined mr-2">description</span>
          <span>Relatórios</span>
        </li>
        <li className="px-4 py-2 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer flex items-center">
          <span className="material-symbols-outlined mr-2">school</span>
          <span>Treinamentos</span>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
