
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  Home, 
  Database, 
  Users, 
  Package, 
  RefreshCw, 
  ChevronLeft, 
  Clipboard, 
  Settings 
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  {
    title: 'Dashboard',
    href: '/',
    icon: Home,
  },
  {
    title: 'Catálogo',
    href: '/catalog',
    icon: Database,
  },
  {
    title: 'Colaboradores',
    href: '/employees',
    icon: Users,
  },
  {
    title: 'Estoque',
    href: '/inventory',
    icon: Package,
  },
  {
    title: 'Movimentações',
    href: '/movements',
    icon: RefreshCw,
  },
  {
    title: 'Inspeções',
    href: '/inspections',
    icon: Clipboard,
  },
  {
    title: 'Configurações',
    href: '/settings',
    icon: Settings,
  },
];

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-safety-gray transition-transform duration-300 ease-in-out lg:static lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded bg-safety-blue text-white flex items-center justify-center mr-2">
              <span className="font-bold">P</span>
            </div>
            <span className="text-lg font-bold">ProtecSureFlow</span>
          </div>
          <button 
            onClick={onClose}
            className="rounded-sm p-1.5 text-muted-foreground hover:bg-sidebar-accent lg:hidden"
          >
            <ChevronLeft size={18} />
            <span className="sr-only">Fechar menu</span>
          </button>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                  isActive
                    ? "bg-safety-blue text-white"
                    : "text-muted-foreground hover:bg-safety-gray-dark/10 hover:text-foreground"
                )}
                end={item.href === '/'}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="border-t p-4">
          <div className="rounded-md bg-safety-blue/10 p-3">
            <h4 className="font-medium text-safety-blue">Precisa de ajuda?</h4>
            <p className="mt-1 text-xs text-muted-foreground">
              Acesse nosso centro de suporte para orientações sobre o sistema.
            </p>
            <button className="mt-2 text-xs font-medium text-safety-blue hover:underline">
              Centro de Suporte
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
