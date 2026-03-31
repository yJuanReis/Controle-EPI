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
  signInWithCredentials: (username: string, password: string, rememberMe?: boolean) => Promise<void>;
  signOut: () => Promise<void>;
  setUserRole: (email: string, role: 'admin' | 'user') => Promise<void>;
  updateUserProfile: (data: {
    name: string;
    email: string;
    currentPassword: string;
    newPassword?: string;
  }) => Promise<void>;
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
  },
  {
    id: '3',
    name: 'Administrador',
    email: 'admim@controleepi.com',
    role: 'admin',
  }
];

// Credenciais para login direto 
const validCredentials = [
  { username: 'admin', password: 'M8n8s53489', role: 'admin' as const, name: 'Administrador', email: 'admin@controleepi.com' },
  { username: 'Flavia', password: '12345', role: 'user' as const, name: 'Flavia', email: 'flavia@controleepi.com' }
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
      // Verificar no localStorage (persistente)
      const savedUser = localStorage.getItem('safetytrack_user');
      // Verificar no sessionStorage (temporário)
      const sessionUser = sessionStorage.getItem('safetytrack_user');
      
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      } else if (sessionUser) {
        setUser(JSON.parse(sessionUser));
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  // Função para login com credenciais (usuário/senha)
  const signInWithCredentials = async (username: string, password: string, rememberMe = false) => {
    setLoading(true);
    try {
      // Sanitizar entrada: remover possíveis espaços extras no início e fim
      const sanitizedUsername = username.trim();
      const sanitizedPassword = password;
      
      // Verificar nas credenciais válidas
      const foundUser = validCredentials.find(
        user => 
          user.username.toLowerCase() === sanitizedUsername.toLowerCase() && 
          user.password === sanitizedPassword
      );

      if (!foundUser) {
        throw new Error('Credenciais inválidas. Por favor, verifique seu usuário e senha.');
      }

      // Criar objeto de usuário autenticado
      const authUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: foundUser.name,
        email: foundUser.email,
        role: foundUser.role,
      };

      // Salvar no localStorage se "lembrar de mim" estiver ativado
      if (rememberMe) {
        localStorage.setItem('safetytrack_user', JSON.stringify(authUser));
      } else {
        sessionStorage.setItem('safetytrack_user', JSON.stringify(authUser));
      }

      setUser(authUser);
      toast.success('Login realizado com sucesso!');
      
      return Promise.resolve();
    } catch (error) {
      console.error('Erro ao fazer login com credenciais:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login');
      return Promise.reject(error);
    } finally {
      setLoading(false);
    }
  };

  // Função para logout
  const signOut = async () => {
    try {
      localStorage.removeItem('safetytrack_user');
      sessionStorage.removeItem('safetytrack_user');
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
      await new Promise(resolve => setTimeout(resolve, 500));
      
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

  const updateUserProfile = async (data: {
    name: string;
    email: string;
    currentPassword: string;
    newPassword?: string;
  }) => {
    try {
      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // Validar senha atual
      const currentUser = validCredentials.find(
        cred => cred.email === user.email && cred.password === data.currentPassword
      );

      if (!currentUser) {
        throw new Error('Senha atual incorreta');
      }

      // Atualizar usuário
      const updatedUser = {
        ...user,
        name: data.name,
        email: data.email
      };

      // Se houver nova senha, atualizar nas credenciais válidas
      if (data.newPassword) {
        const credentialIndex = validCredentials.findIndex(cred => cred.email === user.email);
        if (credentialIndex >= 0) {
          validCredentials[credentialIndex] = {
            ...validCredentials[credentialIndex],
            password: data.newPassword,
            name: data.name,
            email: data.email
          };
        }
      }

      // Atualizar no storage
      const storage = localStorage.getItem('safetytrack_user') ? localStorage : sessionStorage;
      storage.setItem('safetytrack_user', JSON.stringify(updatedUser));
      
      setUser(updatedUser);
      toast.success('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao atualizar perfil');
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      signInWithCredentials, 
      signOut, 
      setUserRole,
      updateUserProfile 
    }}>
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
          prompt: (callback?: (notification: {
            isNotDisplayed: () => boolean;
            isSkippedMoment: () => boolean;
            getNotDisplayedReason: () => string;
            getDismissedReason: () => string;
            getMomentType: () => string;
          }) => void) => void;
          disableAutoSelect: () => void;
        };
        oauth2: {
          initCodeClient: (config: any) => {
            requestCode: () => void;
          };
        };
      };
    };
  }
}

