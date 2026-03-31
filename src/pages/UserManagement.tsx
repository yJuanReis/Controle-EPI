import React, { useState, useEffect } from 'react';
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
import { UserPlus, Shield, User as UserIcon, ArrowUpDown, Eye, EyeOff, Pencil } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserType {
  id: string;
  name: string;
  email: string;
  cargo: string;
  role: 'admin' | 'user';
}

const UserManagement = () => {
  const { user, setUserRole } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [usersList, setUsersList] = useState<UserType[]>([]);
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [novoUsuario, setNovoUsuario] = useState({
    name: '',
    email: '',
    cargo: '',
    senha: '',
    confirmarSenha: '',
    role: 'user' as 'admin' | 'user'
  });
  const [usuarioEditando, setUsuarioEditando] = useState<{
    id: string;
    name: string;
    email: string;
    cargo: string;
    role: 'admin' | 'user';
    senha?: string;
    confirmarSenha?: string;
  } | null>(null);
  const [ordenacao, setOrdenacao] = useState<{
    campo: keyof UserType | '';
    direcao: 'asc' | 'desc';
  }>({
    campo: '',
    direcao: 'asc'
  });

  useEffect(() => {
    // Carregar a lista de usuários do localStorage
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      setUsersList(JSON.parse(savedUsers));
    }
  }, []);

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
    
    // Validações
    if (!novoUsuario.name || !novoUsuario.email || !novoUsuario.cargo || !novoUsuario.senha) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (novoUsuario.senha !== novoUsuario.confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      // Criar novo usuário
      const newUser: UserType = {
        id: Math.random().toString(36).substr(2, 9),
        name: novoUsuario.name,
        email: novoUsuario.email,
        cargo: novoUsuario.cargo,
        role: novoUsuario.role
      };

      // Adicionar credenciais
      const credentials = {
        username: novoUsuario.email,
        password: novoUsuario.senha,
        role: novoUsuario.role,
        name: novoUsuario.name,
        email: novoUsuario.email
      };

      // Atualizar lista de usuários
      const updatedUsers = [...usersList, newUser];
      setUsersList(updatedUsers);
      
      // Salvar no localStorage
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      localStorage.setItem('credentials', JSON.stringify([
        ...JSON.parse(localStorage.getItem('credentials') || '[]'),
        credentials
      ]));
      
      // Limpar formulário e fechar dialog
      setNovoUsuario({
        name: '',
        email: '',
        cargo: '',
        senha: '',
        confirmarSenha: '',
        role: 'user'
      });
      setIsDialogOpen(false);
      toast.success('Usuário criado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      toast.error('Erro ao criar usuário. Tente novamente.');
    }
  };

  const handleEdit = (user: UserType) => {
    setUsuarioEditando({
      ...user,
      senha: '',
      confirmarSenha: ''
    });
    setIsEditDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!usuarioEditando) return;

    // Validações
    if (!usuarioEditando.name || !usuarioEditando.email || !usuarioEditando.cargo) {
      toast.error('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (usuarioEditando.senha && usuarioEditando.senha !== usuarioEditando.confirmarSenha) {
      toast.error('As senhas não coincidem.');
      return;
    }

    try {
      // Atualizar usuário na lista
      const updatedUsers = usersList.map(u => 
        u.id === usuarioEditando.id 
          ? {
              id: u.id,
              name: usuarioEditando.name,
              email: usuarioEditando.email,
              cargo: usuarioEditando.cargo,
              role: usuarioEditando.role
            }
          : u
      );
      setUsersList(updatedUsers);
      
      // Atualizar credenciais se houver nova senha
      if (usuarioEditando.senha) {
        const credentials = JSON.parse(localStorage.getItem('credentials') || '[]');
        const updatedCredentials = credentials.map((c: any) => 
          c.email === usuarioEditando.email
            ? {
                ...c,
                password: usuarioEditando.senha,
                name: usuarioEditando.name,
                role: usuarioEditando.role
              }
            : c
        );
        localStorage.setItem('credentials', JSON.stringify(updatedCredentials));
      }
      
      // Salvar usuários atualizados
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      
      setIsEditDialogOpen(false);
      setUsuarioEditando(null);
      toast.success('Usuário atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      toast.error('Erro ao atualizar usuário. Tente novamente.');
    }
  };

  const alternarOrdenacao = (campo: keyof UserType) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  const usuariosOrdenados = [...usersList].sort((a, b) => {
    if (!ordenacao.campo) return 0;
    const valorA = a[ordenacao.campo];
    const valorB = b[ordenacao.campo];
    return ordenacao.direcao === 'asc' 
      ? valorA > valorB ? 1 : -1
      : valorA < valorB ? 1 : -1;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6 font-sans">
      <Header />
      <Navigation />
      
      <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Gerenciamento de Usuários</h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3">
                <UserPlus size={24} />
                Adicionar Usuário
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Adicionar Novo Usuário</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Nome Completo
                  </label>
                  <Input
                    id="name"
                    value={novoUsuario.name}
                    onChange={(e) => setNovoUsuario(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Nome do usuário"
                    required
                    className="w-full text-lg py-6 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium">
                    E-mail
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={novoUsuario.email}
                    onChange={(e) => setNovoUsuario(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="usuario@exemplo.com"
                    required
                    className="w-full text-lg py-6 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="cargo" className="text-sm font-medium">
                    Cargo
                  </label>
                  <Input
                    id="cargo"
                    value={novoUsuario.cargo}
                    onChange={(e) => setNovoUsuario(prev => ({ ...prev, cargo: e.target.value }))}
                    placeholder="Cargo do usuário"
                    required
                    className="w-full text-lg py-6 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="senha" className="text-sm font-medium">
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      id="senha"
                      type={mostrarSenha ? "text" : "password"}
                      value={novoUsuario.senha}
                      onChange={(e) => setNovoUsuario(prev => ({ ...prev, senha: e.target.value }))}
                      placeholder="Digite a senha"
                      required
                      className="w-full text-lg py-6 px-4"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="confirmarSenha" className="text-sm font-medium">
                    Confirmar Senha
                  </label>
                  <Input
                    id="confirmarSenha"
                    type="password"
                    value={novoUsuario.confirmarSenha}
                    onChange={(e) => setNovoUsuario(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                    placeholder="Confirme a senha"
                    required
                    className="w-full text-lg py-6 px-4"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="role" className="text-sm font-medium">
                    Tipo de Usuário
                  </label>
                  <Select value={novoUsuario.role} onValueChange={(value: 'admin' | 'user') => setNovoUsuario(prev => ({ ...prev, role: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário Comum</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => setIsDialogOpen(false)}
                    className="text-base"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="text-base">
                    Criar Usuário
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          {/* Dialog de Edição */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>Editar Usuário</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleEditSubmit} className="space-y-4 pt-4">
                <div className="space-y-2">
                  <label htmlFor="edit-name" className="text-sm font-medium">
                    Nome Completo
                  </label>
                  <Input
                    id="edit-name"
                    value={usuarioEditando?.name || ''}
                    onChange={(e) => setUsuarioEditando(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                    placeholder="Nome do usuário"
                    required
                    className="w-full text-lg py-6 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-email" className="text-sm font-medium">
                    E-mail
                  </label>
                  <Input
                    id="edit-email"
                    type="email"
                    value={usuarioEditando?.email || ''}
                    onChange={(e) => setUsuarioEditando(prev => prev ? ({ ...prev, email: e.target.value }) : null)}
                    placeholder="usuario@exemplo.com"
                    required
                    className="w-full text-lg py-6 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-cargo" className="text-sm font-medium">
                    Cargo
                  </label>
                  <Input
                    id="edit-cargo"
                    value={usuarioEditando?.cargo || ''}
                    onChange={(e) => setUsuarioEditando(prev => prev ? ({ ...prev, cargo: e.target.value }) : null)}
                    placeholder="Cargo do usuário"
                    required
                    className="w-full text-lg py-6 px-4"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-senha" className="text-sm font-medium">
                    Nova Senha (opcional)
                  </label>
                  <div className="relative">
                    <Input
                      id="edit-senha"
                      type={mostrarSenha ? "text" : "password"}
                      value={usuarioEditando?.senha || ''}
                      onChange={(e) => setUsuarioEditando(prev => prev ? ({ ...prev, senha: e.target.value }) : null)}
                      placeholder="Digite a nova senha"
                      className="w-full text-lg py-6 px-4"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2"
                    >
                      {mostrarSenha ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="edit-confirmar-senha" className="text-sm font-medium">
                    Confirmar Nova Senha
                  </label>
                  <Input
                    id="edit-confirmar-senha"
                    type="password"
                    value={usuarioEditando?.confirmarSenha || ''}
                    onChange={(e) => setUsuarioEditando(prev => prev ? ({ ...prev, confirmarSenha: e.target.value }) : null)}
                    placeholder="Confirme a nova senha"
                    className="w-full text-lg py-6 px-4"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="edit-role" className="text-sm font-medium">
                    Tipo de Usuário
                  </label>
                  <Select 
                    value={usuarioEditando?.role || 'user'} 
                    onValueChange={(value: 'admin' | 'user') => 
                      setUsuarioEditando(prev => prev ? ({ ...prev, role: value }) : null)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Usuário Comum</SelectItem>
                      <SelectItem value="admin">Administrador</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex justify-end gap-4 pt-4">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      setIsEditDialogOpen(false);
                      setUsuarioEditando(null);
                    }}
                    className="text-base"
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" className="text-base">
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="bg-white rounded-lg">
          <div className="mb-6">
            <p className="text-lg text-gray-600 mb-2">
              Gerencie os usuários do sistema e seus níveis de acesso.
            </p>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 border-b-2 border-gray-200">
                  <TableHead 
                    className="text-lg font-bold text-gray-800 py-4 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacao('name')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Nome
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 py-4 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacao('email')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      E-mail
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 py-4 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacao('cargo')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Cargo
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacao('role')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Tipo
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead className="text-lg font-bold text-gray-800 text-center">
                    Status
                  </TableHead>
                  <TableHead className="text-lg font-bold text-gray-800 text-center">
                    Ações
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usuariosOrdenados.length > 0 ? (
                  usuariosOrdenados.map((definedUser) => (
                    <TableRow 
                      key={definedUser.id}
                      className="hover:bg-blue-100 transition-colors"
                    >
                      <TableCell className="text-center py-4">
                        <div className="font-bold text-lg text-gray-900">{definedUser.name}</div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <div className="text-lg text-gray-900">{definedUser.email}</div>
                      </TableCell>
                      <TableCell className="text-center py-4">
                        <div className="text-lg text-gray-900">{definedUser.cargo}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          {definedUser.role === 'admin' ? (
                            <>
                              <Shield className="h-5 w-5 text-primary-600" />
                              <span className="font-semibold text-lg">Administrador</span>
                            </>
                          ) : (
                            <>
                              <UserIcon className="h-5 w-5 text-gray-600" />
                              <span className="font-semibold text-lg">Usuário Comum</span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-3 py-1 rounded-full text-base font-semibold ${
                          definedUser.role === 'admin' 
                            ? 'bg-primary-100 text-primary-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          Ativo
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          onClick={() => handleEdit(definedUser)}
                          variant="ghost"
                          className="hover:bg-blue-100"
                        >
                          <Pencil className="h-5 w-5 text-blue-600" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-gray-500 text-lg">
                      Nenhum usuário cadastrado ainda.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
