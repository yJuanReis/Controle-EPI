
import React, { createContext, useState, useContext, ReactNode } from 'react';

export interface EPI {
  id: number;
  nome: string;
  tipo: string;
  ca: string;
  quantidade: number;
  fornecedor: string;
  validade: string;
  status?: string;
}

interface EPIContextType {
  epis: EPI[];
  setEpis: React.Dispatch<React.SetStateAction<EPI[]>>;
  addEPI: (epi: Omit<EPI, 'id'>) => void;
  updateEPI: (epi: EPI) => void;
  getEPIByName: (name: string) => EPI | undefined;
}

const EPIContext = createContext<EPIContextType | undefined>(undefined);

export const EPIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [epis, setEpis] = useState<EPI[]>([
    { 
      id: 1, 
      nome: 'Capacete de Segurança', 
      tipo: 'Tipo II, Classe B', 
      ca: '12345', 
      quantidade: 25, 
      fornecedor: '3M Brasil',
      validade: '15/12/2023',
      status: 'Próximo ao vencimento'
    },
    { 
      id: 2, 
      nome: 'Luvas de Proteção', 
      tipo: 'Resistente a cortes', 
      ca: '23456', 
      quantidade: 50, 
      fornecedor: 'Ansell Healthcare',
      validade: '20/06/2024',
      status: 'Ativo'
    },
    { 
      id: 3, 
      nome: 'Óculos de Proteção', 
      tipo: 'Lente incolor, UV', 
      ca: '34567', 
      quantidade: 30, 
      fornecedor: 'MSA Safety',
      validade: '10/03/2023',
      status: 'Vencido'
    },
    { 
      id: 4, 
      nome: 'Respirador Semi-facial', 
      tipo: 'PFF2 / N95', 
      ca: '45678', 
      quantidade: 100, 
      fornecedor: '3M Brasil',
      validade: '05/09/2024',
      status: 'Ativo'
    }
  ]);

  const addEPI = (epi: Omit<EPI, 'id'>) => {
    const newId = Math.max(0, ...epis.map(item => item.id)) + 1;
    setEpis([...epis, { ...epi, id: newId }]);
  };

  const updateEPI = (updatedEPI: EPI) => {
    setEpis(epis.map(epi => 
      epi.id === updatedEPI.id ? updatedEPI : epi
    ));
  };

  const getEPIByName = (name: string) => {
    return epis.find(epi => epi.nome === name);
  };

  return (
    <EPIContext.Provider value={{ epis, setEpis, addEPI, updateEPI, getEPIByName }}>
      {children}
    </EPIContext.Provider>
  );
};

export const useEPI = () => {
  const context = useContext(EPIContext);
  if (context === undefined) {
    throw new Error('useEPI must be used within an EPIProvider');
  }
  return context;
};
