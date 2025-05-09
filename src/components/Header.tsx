
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Header = () => {
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
  };

  return (
    <header className="bg-primary-600 text-white rounded-lg shadow-lg p-6 mb-8 transition-all hover:shadow-xl">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2">SafetyTrack EPI</h1>
          <p className="text-primary-100">Sistema de Gestão de Equipamentos de Proteção Individual</p>
        </div>
        <div className="mt-4 md:mt-0">
          <div className="flex items-center space-x-4">
            {/* Notifications Dropdown */}
            <div className="relative">
              <details className="group">
                <summary className="flex items-center space-x-2 cursor-pointer list-none">
                  <span className="material-symbols-outlined">notifications</span>
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </summary>
                <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg p-4 z-10 transform transition-all scale-95 origin-top-right group-open:scale-100">
                  <h3 className="font-semibold mb-2 text-gray-700">Notificações</h3>
                  <ul className="text-gray-600 text-sm">
                    <li className="border-b py-2 hover:bg-gray-50 rounded-md px-2">
                      <p className="font-medium text-red-600">
                        EPI Vencendo: Capacete de Segurança
                      </p>
                      <p>Vence em 5 dias para Carlos Silva</p>
                    </li>
                    <li className="border-b py-2 hover:bg-gray-50 rounded-md px-2">
                      <p className="font-medium text-amber-600">
                        Treinamento Necessário: Uso de Respiradores
                      </p>
                      <p>Para Marcos Oliveira</p>
                    </li>
                    <li className="py-2 hover:bg-gray-50 rounded-md px-2">
                      <p className="font-medium text-blue-600">
                        Renovação de CA Pendente: Luvas
                      </p>
                      <p>Atualizar documentação</p>
                    </li>
                  </ul>
                </div>
              </details>
            </div>
            {/* User Profile Dropdown */}
            <div className="relative">
              <details className="group">
                <summary className="flex items-center space-x-2 cursor-pointer list-none">
                  <div className="h-10 w-10 rounded-full bg-primary-700 flex items-center justify-center border-2 border-white hover:bg-primary-800 transition-colors">
                    <span className="text-white font-semibold">
                      {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                    </span>
                  </div>
                </summary>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg p-2 z-10 transform transition-all scale-95 origin-top-right group-open:scale-100">
                  <div className="px-3 py-2 border-b">
                    <p className="font-medium text-gray-800">{user?.name || 'Usuário'}</p>
                    <p className="text-xs text-gray-500">{user?.email || ''}</p>
                    <div className="mt-1">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                        {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    </div>
                  </div>
                  <ul className="text-gray-600">
                    <li className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center space-x-2">
                      <span className="material-symbols-outlined">person</span>
                      <span>Meu Perfil</span>
                    </li>
                    {user?.role === 'admin' && (
                      <li className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center space-x-2">
                        <span className="material-symbols-outlined">settings</span>
                        <Link to="/gerenciar-usuarios" className="w-full">
                          Gerenciar Usuários
                        </Link>
                      </li>
                    )}
                    <li 
                      onClick={handleLogout}
                      className="px-3 py-2 hover:bg-gray-100 rounded-md cursor-pointer flex items-center space-x-2 text-red-500"
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
