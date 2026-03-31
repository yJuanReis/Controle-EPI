import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { User, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';

const Configuracoes = () => {
  const { user, updateUserProfile } = useAuth();
  const [mostrarSenha, setMostrarSenha] = useState(false);
  const [mostrarNovaSenha, setMostrarNovaSenha] = useState(false);
  const [dadosPerfil, setDadosPerfil] = useState({
    nome: user?.name || '',
    email: user?.email || '',
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  useEffect(() => {
    if (user) {
      setDadosPerfil(prev => ({
        ...prev,
        nome: user.name,
        email: user.email
      }));
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (dadosPerfil.novaSenha && dadosPerfil.novaSenha !== dadosPerfil.confirmarSenha) {
        toast.error('As senhas não coincidem');
        return;
      }

      await updateUserProfile({
        name: dadosPerfil.nome,
        email: dadosPerfil.email,
        currentPassword: dadosPerfil.senhaAtual,
        newPassword: dadosPerfil.novaSenha || undefined
      });

      setDadosPerfil(prev => ({
        ...prev,
        senhaAtual: '',
        novaSenha: '',
        confirmarSenha: ''
      }));

      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar perfil');
    }
  };

  return (
  <div className="min-h-screen bg-gray-50 p-6 space-y-6">
    <Header />
    <Navigation />
    
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Controle - EPIs</h1> {/* Alterado o nome da guia */}
      </div>

      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit}>
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Anchor className="h-5 w-5" /> {/* Alterado para o ícone de âncora */}
                <CardTitle>Informações do Perfil</CardTitle>
              </div>
              <CardDescription>
                Atualize suas informações pessoais e senha
              </CardDescription>
            </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome</Label>
                  <Input 
                    id="nome" 
                    value={dadosPerfil.nome}
                    onChange={(e) => setDadosPerfil(prev => ({ ...prev, nome: e.target.value }))}
                    placeholder="Seu nome" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={dadosPerfil.email}
                    onChange={(e) => setDadosPerfil(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="seu.email@exemplo.com" 
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senhaAtual">Senha Atual</Label>
                  <div className="relative">
                    <Input 
                      id="senhaAtual" 
                      type={mostrarSenha ? "text" : "password"}
                      value={dadosPerfil.senhaAtual}
                      onChange={(e) => setDadosPerfil(prev => ({ ...prev, senhaAtual: e.target.value }))}
                      placeholder="Digite sua senha atual"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarSenha(!mostrarSenha)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {mostrarSenha ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="novaSenha">Nova Senha (opcional)</Label>
                  <div className="relative">
                    <Input 
                      id="novaSenha" 
                      type={mostrarNovaSenha ? "text" : "password"}
                      value={dadosPerfil.novaSenha}
                      onChange={(e) => setDadosPerfil(prev => ({ ...prev, novaSenha: e.target.value }))}
                      placeholder="Digite uma nova senha"
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarNovaSenha(!mostrarNovaSenha)}
                      className="absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {mostrarNovaSenha ? (
                        <EyeOff className="h-4 w-4 text-gray-500" />
                      ) : (
                        <Eye className="h-4 w-4 text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmarSenha">Confirmar Nova Senha</Label>
                  <Input 
                    id="confirmarSenha" 
                    type="password"
                    value={dadosPerfil.confirmarSenha}
                    onChange={(e) => setDadosPerfil(prev => ({ ...prev, confirmarSenha: e.target.value }))}
                    placeholder="Confirme a nova senha"
                    disabled={!dadosPerfil.novaSenha}
                  />
                </div>
                <div className="pt-4">
                  <Button type="submit" className="w-full">
                    Salvar Alterações
                  </Button>
                </div>
              </CardContent>
            </Card>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Configuracoes; 