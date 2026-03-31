import React, { createContext, useState, useContext, ReactNode, useEffect, useMemo } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Colaborador {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: 'ativo' | 'afastado' | 'férias' | 'baixado';
  marina: string;
}

export interface EPI {
  id: number;
  nome: string;
  valorUn: number;
  ca: string;
  quantidade: number;
  fornecedor: string;
  validade: string;
  status?: string;
  valor: number;
}

// Interface para EPIs atribuídos a colaboradores
export interface EPIAtribuido {
  id: string; // ID único para cada EPI atribuído
  epiId: number; // Referência ao EPI no estoque
  colaboradorId: number; // ID do colaborador
  dataAtribuicao: string; // Data em que foi atribuído
  validade: string; // Data de validade deste EPI específico
  status: 'ativo' | 'vencido' | 'proximo_vencimento' | 'devolvido' | 'baixado'; // Status deste EPI
  observacoes?: string; // Observações sobre este EPI
}

// Interface para EPIs devolvidos
export interface EPIDevolvido {
  id: string;
  epiId: number;
  colaboradorId: number;
  dataAtribuicao: string;
  dataDevolucao: string;
  observacoes?: string;
}

// Interface para EPIs perdidos
export interface EPIPerdido {
  id: string;
  epiId: number;
  epiNome: string;
  epiCA: string;
  colaboradorId: number;
  colaboradorNome: string;
  dataPerca: string;
  observacoes: string;
}

// Interface para movimentação
export interface Movimentacao {
  id: string;
  tipo: 'atribuicao' | 'devolucao' | 'vencimento' | 'baixa' | 'atualizacao' | 'perda';
  data: string;
  colaboradorId: number;
  colaboradorNome: string;
  epiId: number;
  epiNome: string;
  epiCA: string;
  status: EPIAtribuido['status'];
  observacoes?: string;
  responsavel?: string;
  detalhes?: {
    statusAnterior?: string;
    motivoBaixa?: string;
    validadeAnterior?: string;
    validadeNova?: string;
  };
}

interface EPIContextType {
  epis: EPI[];
  setEpis: React.Dispatch<React.SetStateAction<EPI[]>>;
  addEPI: (epi: Omit<EPI, 'id'>) => void;
  updateEPI: (epi: EPI) => void;
  getEPIByName: (name: string) => EPI | undefined;
  // Novos métodos para gerenciar EPIs atribuídos
  episAtribuidos: EPIAtribuido[];
  setEpisAtribuidos: React.Dispatch<React.SetStateAction<EPIAtribuido[]>>;
  episDevolvidos: EPIDevolvido[];
  setEpisDevolvidos: React.Dispatch<React.SetStateAction<EPIDevolvido[]>>;
  episPerdidos: EPIPerdido[];
  setEpisPerdidos: React.Dispatch<React.SetStateAction<EPIPerdido[]>>;
  atribuirEPI: (epiId: number, colaboradorId: number, validade: string, observacoes?: string) => void;
  atualizarEPIAtribuido: (epiAtribuido: EPIAtribuido) => void;
  devolverEPI: (epiAtribuidoId: string, observacoes?: string) => void;
  registrarPerdaEPI: (epiAtribuidoId: string, observacoes: string) => void;
  getEPIsDoColaborador: (colaboradorId: number) => EPIAtribuido[];
  getEPIAtribuidoDetalhes: (epiAtribuidoId: string) => { epi: EPI; colaborador: Colaborador; } | undefined;
  // Novas propriedades para movimentações
  movimentacoes: Movimentacao[];
  setMovimentacoes: React.Dispatch<React.SetStateAction<Movimentacao[]>>;
  adicionarMovimentacao: (movimentacao: Omit<Movimentacao, 'id'>) => void;
  getMovimentacoesColaborador: (colaboradorId: number) => Movimentacao[];
}

const EPIContext = createContext<EPIContextType | undefined>(undefined);

export const EPIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [epis, setEpis] = useState<EPI[]>(() => {
    try {
      // Tenta carregar os EPIs do localStorage
      const savedEPIs = localStorage.getItem('epis');
      if (!savedEPIs) return [];
      
      const parsedEPIs = JSON.parse(savedEPIs);
      
      // Valida se os dados são um array e têm a estrutura correta
      if (!Array.isArray(parsedEPIs)) return [];
      
      // Valida cada EPI e garante que tem todos os campos necessários
      return parsedEPIs.map(epi => ({
        id: Number(epi.id) || 0,
        nome: String(epi.nome || ''),
        valorUn: Number(epi.valorUn) || 0,
        ca: String(epi.ca || ''),
        quantidade: Number(epi.quantidade) || 0,
        fornecedor: String(epi.fornecedor || ''),
        validade: String(epi.validade || ''),
        status: String(epi.status || 'Ativo'),
        valor: Number(epi.valorUn || 0) * Number(epi.quantidade || 0)
      }));
    } catch (error) {
      console.error('Erro ao carregar EPIs do localStorage:', error);
      return [];
    }
  });

  // Estado para EPIs atribuídos aos colaboradores
  const [episAtribuidos, setEpisAtribuidos] = useState<EPIAtribuido[]>(() => {
    try {
      const savedEPIs = localStorage.getItem('episAtribuidos');
      if (!savedEPIs) return [];
      
      const parsedEPIs = JSON.parse(savedEPIs);
      if (!Array.isArray(parsedEPIs)) return [];
      
      return parsedEPIs.map(epi => ({
        id: String(epi.id || ''),
        epiId: Number(epi.epiId) || 0,
        colaboradorId: Number(epi.colaboradorId) || 0,
        dataAtribuicao: String(epi.dataAtribuicao || ''),
        validade: String(epi.validade || ''),
        status: epi.status || 'ativo',
        observacoes: epi.observacoes
      }));
    } catch (error) {
      console.error('Erro ao carregar EPIs atribuídos do localStorage:', error);
      return [];
    }
  });

  // Estado para EPIs devolvidos
  const [episDevolvidos, setEpisDevolvidos] = useState<EPIDevolvido[]>(() => {
    try {
      const savedEPIs = localStorage.getItem('episDevolvidos');
      if (!savedEPIs) return [];
      
      const parsedEPIs = JSON.parse(savedEPIs);
      if (!Array.isArray(parsedEPIs)) return [];
      
      return parsedEPIs.map(epi => ({
        id: String(epi.id || ''),
        epiId: Number(epi.epiId) || 0,
        colaboradorId: Number(epi.colaboradorId) || 0,
        dataAtribuicao: String(epi.dataAtribuicao || ''),
        dataDevolucao: String(epi.dataDevolucao || ''),
        observacoes: epi.observacoes
      }));
    } catch (error) {
      console.error('Erro ao carregar EPIs devolvidos do localStorage:', error);
      return [];
    }
  });

  // Novo estado para EPIs perdidos
  const [episPerdidos, setEpisPerdidos] = useState<EPIPerdido[]>(() => {
    try {
      const savedEPIs = localStorage.getItem('episPerdidos');
      if (!savedEPIs) return [];
      
      const parsedEPIs = JSON.parse(savedEPIs);
      if (!Array.isArray(parsedEPIs)) return [];
      
      return parsedEPIs.map(epi => ({
        id: String(epi.id || ''),
        epiId: Number(epi.epiId) || 0,
        epiNome: String(epi.epiNome || ''),
        epiCA: String(epi.epiCA || ''),
        colaboradorId: Number(epi.colaboradorId) || 0,
        colaboradorNome: String(epi.colaboradorNome || ''),
        dataPerca: String(epi.dataPerca || ''),
        observacoes: String(epi.observacoes || '')
      }));
    } catch (error) {
      console.error('Erro ao carregar EPIs perdidos do localStorage:', error);
      return [];
    }
  });

  // Novo estado para movimentações
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>(() => {
    try {
      const savedMovimentacoes = localStorage.getItem('controleEPI_movimentacoes');
      if (!savedMovimentacoes) return [];
      
      const parsedMovimentacoes = JSON.parse(savedMovimentacoes);
      if (!Array.isArray(parsedMovimentacoes)) return [];
      
      return parsedMovimentacoes.map(mov => ({
        id: String(mov.id || ''),
        tipo: mov.tipo || 'atribuicao',
        data: String(mov.data || ''),
        colaboradorId: Number(mov.colaboradorId) || 0,
        colaboradorNome: String(mov.colaboradorNome || ''),
        epiId: Number(mov.epiId) || 0,
        epiNome: String(mov.epiNome || ''),
        epiCA: String(mov.epiCA || ''),
        status: mov.status || 'ativo',
        observacoes: mov.observacoes,
        responsavel: mov.responsavel,
        detalhes: mov.detalhes
      }));
    } catch (error) {
      console.error('Erro ao carregar movimentações do localStorage:', error);
      return [];
    }
  });

  // Salva os EPIs no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('epis', JSON.stringify(epis));
  }, [epis]);

  // Salva os EPIs atribuídos no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('episAtribuidos', JSON.stringify(episAtribuidos));
  }, [episAtribuidos]);

  useEffect(() => {
    localStorage.setItem('episDevolvidos', JSON.stringify(episDevolvidos));
  }, [episDevolvidos]);

  useEffect(() => {
    localStorage.setItem('episPerdidos', JSON.stringify(episPerdidos));
  }, [episPerdidos]);

  useEffect(() => {
    localStorage.setItem('controleEPI_movimentacoes', JSON.stringify(movimentacoes));
  }, [movimentacoes]);

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
  
  // Função para adicionar uma nova movimentação
  const adicionarMovimentacao = (novaMovimentacao: Omit<Movimentacao, 'id'>) => {
    const movimentacao: Movimentacao = {
      ...novaMovimentacao,
      id: Date.now().toString()
    };
    setMovimentacoes(prev => [...prev, movimentacao]);
  };

  // Função para atribuir um EPI a um colaborador
  const atribuirEPI = (epiId: number, colaboradorId: number, validade: string, observacoes?: string) => {
    // Decrementar a quantidade no estoque
    setEpis(current => 
      current.map(epi => 
        epi.id === epiId 
          ? { ...epi, quantidade: Math.max(0, epi.quantidade - 1) }
          : epi
      )
    );
    
    // Gerar um ID único para o EPI atribuído
    const novoId = Date.now().toString();
    const hoje = new Date().toLocaleDateString('pt-BR');
    
    // Calcular o status com base na validade
    const validadeDate = new Date(validade.split('/').reverse().join('-'));
    const hoje30Dias = new Date();
    hoje30Dias.setDate(hoje30Dias.getDate() + 30);
    
    let status: EPIAtribuido['status'] = 'ativo';
    if (validadeDate < new Date()) {
      status = 'vencido';
    } else if (validadeDate <= hoje30Dias) {
      status = 'proximo_vencimento';
    }
    
    // Adicionar o novo EPI atribuído
    const novoEPIAtribuido: EPIAtribuido = {
      id: novoId,
      epiId,
      colaboradorId,
      dataAtribuicao: hoje,
      validade,
      status,
      observacoes
    };
    
    setEpisAtribuidos([...episAtribuidos, novoEPIAtribuido]);
    
    // Buscar informações adicionais
    const epi = epis.find(e => e.id === epiId);
    const colaborador = JSON.parse(localStorage.getItem('colaboradores') || '[]')
      .find((c: any) => c.id === colaboradorId);

    if (epi && colaborador) {
      // Registrar a movimentação
      adicionarMovimentacao({
        tipo: 'atribuicao',
        data: hoje,
        colaboradorId: colaborador.id,
        colaboradorNome: colaborador.nome,
        epiId: epi.id,
        epiNome: epi.nome,
        epiCA: epi.ca,
        status,
        observacoes,
        responsavel: "Admin"
      });
    }
    
    return novoEPIAtribuido;
  };
  
  // Função para atualizar um EPI atribuído
  const atualizarEPIAtribuido = (epiAtualizado: EPIAtribuido) => {
    setEpisAtribuidos(current => 
      current.map(epi => 
        epi.id === epiAtualizado.id ? epiAtualizado : epi
      )
    );
  };
  
  // Função para devolver um EPI (remove da lista de atribuídos e incrementa estoque)
  const devolverEPI = (epiAtribuidoId: string, observacoes?: string) => {
    const epiAtribuido = episAtribuidos.find(epi => epi.id === epiAtribuidoId);
    
    if (epiAtribuido) {
      // Remover da lista de EPIs atribuídos
      setEpisAtribuidos(current => current.filter(epi => epi.id !== epiAtribuidoId));
      
      // Adicionar à lista de EPIs devolvidos
      const epiDevolvido: EPIDevolvido = {
        id: epiAtribuidoId,
        epiId: epiAtribuido.epiId,
        colaboradorId: epiAtribuido.colaboradorId,
        dataAtribuicao: epiAtribuido.dataAtribuicao,
        dataDevolucao: new Date().toLocaleDateString('pt-BR'),
        observacoes
      };
      
      setEpisDevolvidos(current => [...current, epiDevolvido]);
      
      // Incrementar estoque apenas se não estiver vencido
      if (epiAtribuido.status !== 'vencido') {
        setEpis(current => 
          current.map(epi => 
            epi.id === epiAtribuido.epiId 
              ? { ...epi, quantidade: epi.quantidade + 1 }
              : epi
          )
        );
      }

      // Buscar informações adicionais
      const epi = epis.find(e => e.id === epiAtribuido.epiId);
      const colaborador = JSON.parse(localStorage.getItem('colaboradores') || '[]')
        .find((c: any) => c.id === epiAtribuido.colaboradorId);

      if (epi && colaborador) {
        // Registrar a movimentação de devolução
        adicionarMovimentacao({
          tipo: 'devolucao',
          data: new Date().toLocaleDateString('pt-BR'),
          colaboradorId: colaborador.id,
          colaboradorNome: colaborador.nome,
          epiId: epi.id,
          epiNome: epi.nome,
          epiCA: epi.ca,
          status: 'devolvido',
          observacoes: observacoes || "Devolução do EPI",
          responsavel: "Admin"
        });
      }
    }
  };
  
  // Função para registrar perda de EPI
  const registrarPerdaEPI = (epiAtribuidoId: string, observacoes: string) => {
    const epiAtribuido = episAtribuidos.find(epi => epi.id === epiAtribuidoId);
    if (!epiAtribuido) return;

    const detalhes = getEPIAtribuidoDetalhes(epiAtribuidoId);
    if (!detalhes) return;

    // Registra o EPI como perdido
    const epiPerdido: EPIPerdido = {
      id: uuidv4(),
      epiId: detalhes.epi.id,
      epiNome: detalhes.epi.nome,
      epiCA: detalhes.epi.ca,
      colaboradorId: detalhes.colaborador.id,
      colaboradorNome: detalhes.colaborador.nome,
      dataPerca: new Date().toLocaleDateString(),
      observacoes
    };

    setEpisPerdidos(prev => [...prev, epiPerdido]);

    // Remove o EPI da lista de atribuídos
    setEpisAtribuidos(prev => prev.filter(epi => epi.id !== epiAtribuidoId));

    // Registra a movimentação
    const movimentacao: Movimentacao = {
      id: uuidv4(),
      tipo: 'perda',
      data: new Date().toLocaleDateString(),
      colaboradorId: detalhes.colaborador.id,
      colaboradorNome: detalhes.colaborador.nome,
      epiId: detalhes.epi.id,
      epiNome: detalhes.epi.nome,
      epiCA: detalhes.epi.ca,
      status: 'baixado',
      observacoes
    };

    setMovimentacoes(prev => [...prev, movimentacao]);
  };
  
  // Cache de EPIs por colaborador
  const episPorColaborador = useMemo(() => {
    const cache = new Map<number, EPIAtribuido[]>();
    episAtribuidos.forEach(epi => {
      if (!cache.has(epi.colaboradorId)) {
        cache.set(epi.colaboradorId, []);
      }
      cache.get(epi.colaboradorId)?.push(epi);
    });
    return cache;
  }, [episAtribuidos]);

  // Cache de movimentações por colaborador
  const movimentacoesPorColaborador = useMemo(() => {
    const cache = new Map<number, Movimentacao[]>();
    movimentacoes.forEach(mov => {
      if (!cache.has(mov.colaboradorId)) {
        cache.set(mov.colaboradorId, []);
      }
      cache.get(mov.colaboradorId)?.push(mov);
    });
    return cache;
  }, [movimentacoes]);

  // Função otimizada para obter EPIs do colaborador
  const getEPIsDoColaborador = (colaboradorId: number) => {
    return episPorColaborador.get(colaboradorId) || [];
  };

  // Função otimizada para obter movimentações do colaborador
  const getMovimentacoesColaborador = (colaboradorId: number) => {
    return movimentacoesPorColaborador.get(colaboradorId) || [];
  };
  
  // Função para obter detalhes completos de um EPI atribuído
  const getEPIAtribuidoDetalhes = (epiAtribuidoId: string) => {
    const atribuicao = episAtribuidos.find(epi => epi.id === epiAtribuidoId);
    
    if (!atribuicao) return undefined;
    
    const epi = epis.find(e => e.id === atribuicao.epiId);
    
    if (!epi) return undefined;
    
    const colaborador = JSON.parse(localStorage.getItem('colaboradores') || '[]')
      .find((c: any) => c.id === atribuicao.colaboradorId);

    if (!colaborador) return undefined;
    
    return { epi, colaborador };
  };

  return (
    <EPIContext.Provider value={{ 
      epis, 
      setEpis, 
      addEPI, 
      updateEPI, 
      getEPIByName,
      episAtribuidos,
      setEpisAtribuidos,
      episDevolvidos,
      setEpisDevolvidos,
      episPerdidos,
      setEpisPerdidos,
      atribuirEPI,
      atualizarEPIAtribuido,
      devolverEPI,
      registrarPerdaEPI,
      getEPIsDoColaborador,
      getEPIAtribuidoDetalhes,
      movimentacoes,
      setMovimentacoes,
      adicionarMovimentacao,
      getMovimentacoesColaborador
    }}>
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
