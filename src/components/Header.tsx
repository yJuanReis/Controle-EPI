import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Bell, LogOut, Settings, User, Shield, AlertTriangle } from 'lucide-react';
import { useNotificacoes } from '@/contexts/NotificacoesContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const { user, signOut } = useAuth();
  const { notificacoes, notificacoesNaoLidas, marcarComoLida } = useNotificacoes();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  return (
    <header className="bg-gradient-to-r from-primary-700 to-primary-600 text-white rounded-xl shadow-lg p-6 mb-8 transition-all hover:shadow-xl">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-lg shadow-md">
            <Shield className="h-8 w-8 text-primary-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold mb-1">Controle de EPI</h1>
            <p className="text-primary-100 text-sm">Sistema de Gestão de Equipamentos de Proteção Individual</p>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center space-x-2 bg-primary-800 hover:bg-primary-900 transition-colors rounded-lg px-4 py-2">
              <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center">
                <span className="text-primary-600 font-semibold">
                  {user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                </span>
              </div>
              <div className="text-left">
                <div className="font-medium">{user?.name || 'Usuário'}</div>
                <div className="text-xs text-primary-200">{user?.email}</div>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium leading-none">{user?.name}</p>
                <p className="text-xs leading-none text-muted-foreground">
                  {user?.email}
                </p>
                <div className="mt-1">
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                    {user?.role === 'admin' ? 'Administrador' : 'Usuário'}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <Link to="/configuracoes" className="w-full">
                <DropdownMenuItem className="w-full cursor-pointer">
                  <User className="mr-2 h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
              </Link>
              {user?.role === 'admin' && (
                <Link to="/gerenciar-usuarios" className="w-full">
                  <DropdownMenuItem className="w-full cursor-pointer">
                    <User className="mr-2 h-4 w-4" />
                    <span>Gerenciar Usuários</span>
                  </DropdownMenuItem>
                </Link>
              )}
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Sair</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;
