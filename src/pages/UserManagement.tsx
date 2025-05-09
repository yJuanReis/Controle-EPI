
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserPlus } from 'lucide-react';

const UserManagement = () => {
  const { user, setUserRole } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'user'>('user');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Se o usuário não for admin, não mostra a página
  if (!user || user.role !== 'admin') {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h2 className="text-xl font-semibold mb-2">Acesso Restrito</h2>
        <p className="text-gray-500">Você não tem permissão para acessar essa página.</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Por favor, informe um e-mail válido.');
      return;
    }

    try {
      await setUserRole(email, role);
      setEmail('');
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Erro ao definir tipo de usuário:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2" />
              Definir Tipo de Usuário
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Definir Tipo de Usuário</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  E-mail do Usuário
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="usuario@exemplo.com"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Tipo de Usuário
                </label>
                <select
                  id="role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as 'admin' | 'user')}
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  <option value="user">Usuário Comum</option>
                  <option value="admin">Administrador</option>
                </select>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancelar
                </Button>
                <Button type="submit">Salvar</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <p className="text-sm text-gray-500 mb-2">
            Aqui você pode definir quais usuários são administradores do sistema.
          </p>
          <p className="text-sm text-gray-500">
            Administradores têm acesso a todas as funcionalidades, incluindo o gerenciamento de usuários.
          </p>
        </div>

        {/* Aqui pode ser adicionada uma lista de usuários no futuro */}
        <div className="mt-6 p-4 bg-gray-50 rounded-md">
          <p className="text-center text-gray-500">
            Os tipos de usuário são definidos pelo e-mail.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
