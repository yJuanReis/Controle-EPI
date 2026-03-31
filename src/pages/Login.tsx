import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn } from 'lucide-react';
import LoginErrorMessage from '@/components/LoginErrorMessage';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const Login = () => {
  const { signInWithCredentials, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<{message: string, details?: string} | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [credentialLoading, setCredentialLoading] = useState(false);
  
  // Se o usuário já estiver autenticado, redireciona para o dashboard
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Função para lidar com o login com credenciais
  const handleCredentialLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      setError({
        message: 'Por favor, preencha o nome de usuário e senha.',
        details: 'Ambos os campos são obrigatórios para fazer login.'
      });
      return;
    }
    
    setError(null);
    setCredentialLoading(true);
    
    try {
      await signInWithCredentials(username, password, rememberMe);
      // Se o login for bem-sucedido, o useEffect irá redirecionar para o dashboard
    } catch (error) {
      console.error('Erro ao fazer login com credenciais:', error);
      setError({
        message: 'Não foi possível fazer login. Por favor, verifique suas credenciais.',
        details: error instanceof Error ? error.message : 'Erro desconhecido'
      });
    } finally {
      setCredentialLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-[#00A2FF]">
      {/* Container do login */}
      <div className="relative mx-auto my-auto flex max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        {/* Coluna esquerda (login) */}
        <div className="w-full bg-[#00A2FF] p-10 md:w-1/2">
          <div className="mx-auto max-w-md space-y-6">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white">Bem Vindo</h1>
            </div>

            {error && <LoginErrorMessage message={error.message} details={error.details} />}

            <form className="space-y-5" onSubmit={handleCredentialLogin}>
              <div className="relative">
                <Input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Usuário"
                  className="h-12 rounded-full bg-white pl-4 pr-4 text-gray-800 border-none"
                />
              </div>
              
              <div className="relative">
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="• • • • • • • •"
                  className="h-12 rounded-full bg-white pl-4 pr-4 text-gray-800 border-none"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked === true)}
                    className="border-white data-[state=checked]:bg-white data-[state=checked]:text-[#00A2FF]"
                  />
                  <label 
                    htmlFor="remember" 
                    className="cursor-pointer text-sm text-white"
                  >
                    Lembrar
                  </label>
                </div>
                
                <a href="#" className="text-sm text-white hover:underline">
                  Esqueceu a senha?
                </a>
              </div>

              {/* Botão de login com credenciais */}
              <Button 
                type="submit"
                className="mt-4 h-12 w-full rounded-full bg-[#0090e0] text-white hover:bg-[#0082c9] text-md font-medium border-none shadow-md transition-colors"
                size="lg"
                disabled={credentialLoading}
              >
                {credentialLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    <span>Processando...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center">
                    <LogIn className="mr-2 h-5 w-5" />
                    Entrar
                  </div>
                )}
              </Button>
            </form>
          </div>
        </div>

        {/* Coluna direita (imagem/logo) */}
        <div className="hidden md:block md:w-1/2">
          <div className="flex h-full items-center justify-center bg-white p-18">
            <div className="text-center">
              <h2 className="mb-2 text-5xl font-bold text-gray-800">Controle de EPI</h2>
              <p className="text-gray-600">
                Sistema de Gestão de Equipamentos de Proteção Individual - BR Marinas
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
