
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

    checkSession();
  }, []);

  // Função para login com Google (simulação)
  const signInWithGoogle = async () => {
    setLoading(true);
    try {
      // Simula uma chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Simula um login com Google
      // No mundo real, isso seria substituído pela integração real com o Google
      const mockUser: User = {
        id: '3',
        name: 'Usuário Google',
        email: 'usuario.google@gmail.com',
        photoURL: 'https://via.placeholder.com/150',
        role: 'user',
      };
      
      localStorage.setItem('safetytrack_user', JSON.stringify(mockUser));
      setUser(mockUser);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer login com Google:', error);
      toast.error('Erro ao fazer login com Google.');
    } finally {
      setLoading(false);
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
