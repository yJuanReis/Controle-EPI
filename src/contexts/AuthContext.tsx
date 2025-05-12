
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/sonner';

// Tipos para o usuário
export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string;
  role: 'admin' | 'user';
}

// Tipo para o contexto de autenticação
interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  setUserRole: (email: string, role: 'admin' | 'user') => Promise<void>;
}

// Mock de dados de usuário para demonstração
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Administrador',
    email: 'admin@exemplo.com',
    role: 'admin',
  },
  {
    id: '2',
    name: 'Usuário Teste',
    email: 'usuario@exemplo.com',
    role: 'user',
  }
];

// Cria o contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook para usar o contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

// Provider do contexto
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Simula verificação de sessão ao carregar a página
  useEffect(() => {
    const checkSession = () => {
      const savedUser = localStorage.getItem('safetytrack_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
      setLoading(false);
    };

    // Carrega o SDK do Google
    const loadGoogleScript = () => {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      
      script.onload = () => {
        // Verifica se já existe um token de usuário no localStorage
        checkSession();
      };
    };
    
    loadGoogleScript();
  }, []);

  // Função para login com Google
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      return new Promise<void>((resolve, reject) => {
        if (!window.google) {
          toast.error('SDK do Google não carregado. Tente novamente.');
          setLoading(false);
          reject(new Error('SDK do Google não carregado'));
          return;
        }

        // ID de cliente do OAuth 2.0
        // Normalmente, você precisa registrar seu aplicativo no Google Cloud Console
        // e obter um ID de cliente. Este é um ID de exemplo.
        const clientId = '123456789012-abc123def456ghi789jkl012mno345pq.apps.googleusercontent.com';

        const handleCredentialResponse = (response: any) => {
          // Decodificar o token JWT
          const decodedToken = decodeJwtResponse(response.credential);
          
          // Criar usuário com informações do Google
          const googleUser: User = {
            id: decodedToken.sub,
            name: decodedToken.name,
            email: decodedToken.email,
            photoURL: decodedToken.picture,
            role: 'user', // Por padrão, novos usuários são 'user'
          };

          // Salvar no localStorage
          localStorage.setItem('safetytrack_user', JSON.stringify(googleUser));
          setUser(googleUser);
          toast.success('Login realizado com sucesso!');
          setLoading(false);
          resolve();
        };

        // Função para decodificar JWT
        function decodeJwtResponse(token: string) {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          return JSON.parse(jsonPayload);
        }

        try {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });
          
          window.google.accounts.id.renderButton(
            document.getElementById('googleLoginButton') as HTMLElement,
            { theme: 'outline', size: 'large', width: '100%' }
          );
          
          window.google.accounts.id.prompt();
          setLoading(false);
        } catch (error) {
          console.error('Erro ao inicializar Google Sign-In:', error);
          toast.error('Falha ao inicializar login com Google.');
          setLoading(false);
          reject(error);
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      toast.error('Erro ao fazer login com Google.');
      setLoading(false);
      throw error;
    }
  };

  // Função para logout
  const signOut = async () => {
    try {
      localStorage.removeItem('safetytrack_user');
      setUser(null);
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      toast.error('Erro ao fazer logout.');
    }
  };

  // Função para definir role de usuário
  const setUserRole = async (email: string, role: 'admin' | 'user') => {
    try {
      // Simula uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Atualiza o usuário atual se for o mesmo email
      if (user && user.email === email) {
        const updatedUser = { ...user, role };
        localStorage.setItem('safetytrack_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
      }
      
      toast.success(`Tipo de usuário alterado para: ${role}`);
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao atualizar tipo de usuário:', error);
      toast.error('Erro ao atualizar tipo de usuário.');
      return Promise.reject(error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithGoogle, signOut, setUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};

// Adicionar a interface do Google ao Window
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (element: HTMLElement, options: any) => void;
          prompt: () => void;
        };
      };
    };
  }
}

