
import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { LogIn } from 'lucide-react';

const Login = () => {
  const { signInWithGoogle, user } = useAuth();
  const navigate = useNavigate();
  const googleButtonRef = useRef<HTMLDivElement>(null);

  // Se o usuário já estiver autenticado, redireciona para o dashboard
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleGoogleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error('Erro ao fazer login:', error);
    }
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-100 to-primary-50 py-12 px-4 sm:px-6 lg:px-8"
      style={{ 
        backgroundImage: 'url("https://images.unsplash.com/photo-1599249300635-37f1671c44b4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-primary-900/60 backdrop-blur-sm"></div>
      
      <div className="max-w-md w-full space-y-8 z-10">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-primary-600 py-6 px-8">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-white">SafetyTrack EPI</h1>
              <p className="mt-2 text-sm text-primary-100">
                Sistema de Gestão de Equipamentos de Proteção Individual
              </p>
            </div>
          </div>
          
          <div className="py-8 px-8 space-y-6">
            <h2 className="text-center text-xl font-medium text-gray-800">Entre com sua conta</h2>
            
            <div className="space-y-5">
              <div 
                id="googleLoginButton" 
                className="flex justify-center"
              ></div>
              
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">ou</span>
                </div>
              </div>
              
              <Button 
                onClick={handleGoogleLogin} 
                className="w-full flex items-center justify-center py-6 bg-primary-600 hover:bg-primary-700 transition-all duration-200 shadow-md hover:shadow-lg"
                size="lg"
              >
                <LogIn className="mr-2" />
                Entrar com Google
              </Button>
              
              <div className="text-center mt-6 text-sm text-gray-500">
                <p>
                  Ao entrar, você concorda com nossos termos e condições.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <p className="text-sm text-white/80">
            © {new Date().getFullYear()} SafetyTrack EPI. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
