
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-primary-600">SafetyTrack EPI</h1>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de Gestão de Equipamentos de Proteção Individual
          </p>
        </div>
        
        <div className="bg-white py-8 px-6 shadow rounded-lg">
          <h2 className="text-center text-xl font-medium mb-6">Entre com sua conta</h2>
          
          <div className="space-y-4">
            <div id="googleLoginButton"></div>
            
            <Button 
              onClick={handleGoogleLogin} 
              className="w-full flex items-center justify-center py-6"
              size="lg"
            >
              <LogIn className="mr-2" />
              Entrar com Google
            </Button>
            
            <div className="text-center mt-4 text-sm text-gray-500">
              <p>
                Ao entrar, você concorda com nossos termos e condições.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

