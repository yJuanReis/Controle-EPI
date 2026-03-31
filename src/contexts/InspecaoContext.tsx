import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { Inspecao, InspecaoFormData } from '../types/inspecao';

interface InspecaoContextType {
  inspecoes: Inspecao[];
  setInspecoes: React.Dispatch<React.SetStateAction<Inspecao[]>>;
  adicionarInspecao: (inspecao: InspecaoFormData) => void;
  atualizarInspecao: (inspecao: Inspecao) => void;
  removerInspecao: (id: string) => void;
  getInspecoesDoColaborador: (colaboradorId: number) => Inspecao[];
  getInspecoesDoEPI: (epiId: number) => Inspecao[];
  getInspecoesPorStatus: (status: Inspecao['status']) => Inspecao[];
  getInspecoesRecentes: (limite?: number) => Inspecao[];
}

const InspecaoContext = createContext<InspecaoContextType | undefined>(undefined);

export const InspecaoProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [inspecoes, setInspecoes] = useState<Inspecao[]>(() => {
    try {
      const savedInspecoes = localStorage.getItem('inspecoes');
      if (!savedInspecoes) return [];
      
      const parsedInspecoes = JSON.parse(savedInspecoes);
      if (!Array.isArray(parsedInspecoes)) return [];
      
      return parsedInspecoes.map(inspecao => ({
        id: String(inspecao.id || ''),
        data: String(inspecao.data || ''),
        epiId: Number(inspecao.epiId) || 0,
        epiNome: String(inspecao.epiNome || ''),
        epiCA: String(inspecao.epiCA || ''),
        colaboradorId: Number(inspecao.colaboradorId) || 0,
        colaboradorNome: String(inspecao.colaboradorNome || ''),
        status: inspecao.status || 'aprovado',
        observacoes: inspecao.observacoes,
        inspetor: String(inspecao.inspetor || ''),
        proximaInspecao: inspecao.proximaInspecao
      }));
    } catch (error) {
      console.error('Erro ao carregar inspeções do localStorage:', error);
      return [];
    }
  });

  // Salva as inspeções no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('inspecoes', JSON.stringify(inspecoes));
  }, [inspecoes]);

  const adicionarInspecao = (novaInspecao: InspecaoFormData) => {
    const inspecao: Inspecao = {
      ...novaInspecao,
      id: Date.now().toString(),
      data: new Date().toLocaleDateString('pt-BR'),
      epiNome: '', // Será preenchido pelo componente
      epiCA: '', // Será preenchido pelo componente
      colaboradorNome: '' // Será preenchido pelo componente
    };
    
    setInspecoes(prev => [...prev, inspecao]);
  };

  const atualizarInspecao = (inspecaoAtualizada: Inspecao) => {
    setInspecoes(prev => 
      prev.map(inspecao => 
        inspecao.id === inspecaoAtualizada.id ? inspecaoAtualizada : inspecao
      )
    );
  };

  const removerInspecao = (id: string) => {
    setInspecoes(prev => prev.filter(inspecao => inspecao.id !== id));
  };

  const getInspecoesDoColaborador = (colaboradorId: number) => {
    return inspecoes.filter(inspecao => inspecao.colaboradorId === colaboradorId);
  };

  const getInspecoesDoEPI = (epiId: number) => {
    return inspecoes.filter(inspecao => inspecao.epiId === epiId);
  };

  const getInspecoesPorStatus = (status: Inspecao['status']) => {
    return inspecoes.filter(inspecao => inspecao.status === status);
  };

  const getInspecoesRecentes = (limite: number = 10) => {
    return [...inspecoes]
      .sort((a, b) => new Date(b.data.split('/').reverse().join('-')).getTime() - 
                      new Date(a.data.split('/').reverse().join('-')).getTime())
      .slice(0, limite);
  };

  return (
    <InspecaoContext.Provider value={{ 
      inspecoes, 
      setInspecoes, 
      adicionarInspecao, 
      atualizarInspecao, 
      removerInspecao,
      getInspecoesDoColaborador,
      getInspecoesDoEPI,
      getInspecoesPorStatus,
      getInspecoesRecentes
    }}>
      {children}
    </InspecaoContext.Provider>
  );
};

export const useInspecao = () => {
  const context = useContext(InspecaoContext);
  if (context === undefined) {
    throw new Error('useInspecao must be used within an InspecaoProvider');
  }
  return context;
};