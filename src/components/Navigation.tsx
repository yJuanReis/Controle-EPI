
import React from 'react';

const Navigation = () => {
  return (
    <nav className="bg-white rounded-lg shadow-md p-4 mb-8">
      <ul className="flex flex-wrap justify-between">
        <li className="px-4 py-2 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer flex items-center">
          <span className="material-symbols-outlined mr-2">dashboard</span>
          <span>Dashboard</span>
        </li>
        <li className="px-4 py-2 bg-primary-50 text-primary-700 rounded-lg transition-colors cursor-pointer flex items-center">
          <span className="material-symbols-outlined mr-2">shield</span>
          <span>EPIs</span>
        </li>
        <li className="px-4 py-2 hover:bg-primary-50 rounded-lg transition-colors cursor-pointer flex items-center">
          <span className="material-symbols-outlined mr-2">people</span>
          <span>Colaboradores</span>
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
