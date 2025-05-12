
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-xl shadow-lg p-6 mb-8 transition-all hover:shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">SafetyTrack EPI</h1>
            <p className="text-primary-100 text-sm">Sistema de Gestão de Equipamentos de Proteção Individual</p>
          </div>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <details className="group">
                <summary className="flex items-center space-x-2 cursor-pointer list-none hover:bg-primary-500 p-2 rounded-full transition-all">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </summary>
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-10 transform transition-all scale-95 origin-top-right group-open:scale-100 border border-gray-100">
                  <h3 className="font-semibold mb-2 text-gray-700">Notificações</h3>
                  <ul className="text-gray-600 text-sm space-y-1">
                    <li className="border-b py-2 hover:bg-gray-50 rounded-md px-2 transition-colors">
                      <p className="font-medium text-red-600">
                        EPI Vencendo: Capacete de Segurança
                      </p>
                      <p className="text-xs text-gray-500">Vence em 5 dias para Carlos Silva</p>
                    </li>
                    <li className="border-b py-2 hover:bg-gray-50 rounded-md px-2 transition-colors">
                      <p className="font-medium text-amber-600">
                        Treinamento Necessário: Uso de Respiradores
                      </p>
                      <p className="text-xs text-gray-500">Para Marcos Oliveira</p>
                    </li>
                    <li className="py-2 hover:bg-gray-50 rounded-md px-2 transition-colors">
                      <p className="font-medium text-blue-600">
                        Renovação de CA Pendente: Luvas
                      </p>
                      <p className="text-xs text-gray-500">Atualizar documentação</p>
                    </li>
                  </ul>
                </div>
              </details>
            </div>
            {/* User Profile Dropdown */}
            <div className="relative">
              <details className="group">
                <summary className="flex items-center space-x-2 cursor-pointer list-none">
                  <div className="h-10 w-10 rounded-full bg-primary-800 flex items-center justify-center border-2 border-white hover:bg-primary-900 transition-colors">
                    <span className="text-white font-semibold">
                      {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                    </span>
                  </div>
                </summary>
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg p-2 z-10 transform transition-all scale-95 origin-top-right group-open:scale-100 border border-gray-100">
                  <div className="px-4 py-3 border-b">
                    <p className="font-medium text-gray-800">{user?.name || 'Usuário'}</p>
                    <p className="text-xs text-gray-500">{user?.email || ''}</p>
                    <div className="mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </div>
                  </div>
                  <ul className="text-gray-600 py-2">
                    <li className="px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center space-x-2 transition-colors">
                      <span className="material-symbols-outlined text-gray-500">person</span>
                      <span>Meu Perfil</span>
                    </li>
                    {user?.role === 'admin' && (
                      <li className="px-4 py-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center space-x-2 transition-colors">
                        <span className="material-symbols-outlined text-gray-500">settings</span>
                        <Link to="/gerenciar-usuarios" className="w-full">
                          Gerenciar Usuários
                        </Link>
                      </li>
                    )}
                    <li 
                      onClick={handleLogout}
                      className="px-4 py-2 hover:bg-red-50 rounded-md cursor-pointer flex items-center space-x-2 text-red-500 transition-colors"
                    >
                      <span className="material-symbols-outlined">logout</span>
                      <span>Sair</span>
                    </li>
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
