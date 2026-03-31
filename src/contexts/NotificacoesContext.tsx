import React, { createContext, useContext, useState, useEffect } from 'react';
import { useEPI } from './EPIContext';
import { toast } from '@/components/ui/sonner';

interface Notificacao {
  id: string;
  tipo: 'epi_vencido' | 'epi_proximo_vencimento';
  titulo: string;
  mensagem: string;
  data: Date;
  lida: boolean;
  epiId: string;
  colaboradorId: number;
}

interface NotificacoesContextType {
  notificacoes: Notificacao[];
  notificacoesNaoLidas: number;
  marcarComoLida: (id: string) => void;
  marcarTodasComoLidas: () => void;
  limparNotificacoes: () => void;
  atualizarPrazoNotificacao: (dias: number) => void;
}

const NotificacoesContext = createContext<NotificacoesContextType | undefined>(undefined);

export const NotificacoesProvider = ({ children }: { children: React.ReactNode }) => {
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [diasParaNotificar, setDiasParaNotificar] = useState(30);
  const { episAtribuidos, getEPIAtribuidoDetalhes } = useEPI();

  // Verifica EPIs vencidos e próximos ao vencimento
  useEffect(() => {
    const verificarEPIs = () => {
      const novasNotificacoes: Notificacao[] = [];

      episAtribuidos.forEach(epiAtribuido => {
        const detalhes = getEPIAtribuidoDetalhes(epiAtribuido.id);
        if (!detalhes) return;

        // Verifica se o EPI está vencido
        const dataValidade = new Date(epiAtribuido.validade.split('/').reverse().join('-'));
        const hoje = new Date();
        const diasAteVencimento = Math.floor((dataValidade.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));

        const notificacaoId = `${epiAtribuido.id}-${epiAtribuido.status}`;
        const notificacaoExistente = notificacoes.find(n => n.id === notificacaoId);

        // Se o EPI está vencido (dias negativos ou zero)
        if (diasAteVencimento <= 0 && !notificacaoExistente) {
          const colaborador = detalhes.colaborador;
          const nomeColaborador = colaborador?.nome || 'Colaborador não identificado';

          novasNotificacoes.push({
            id: notificacaoId,
            tipo: 'epi_vencido',
            titulo: 'EPI Vencido',
            mensagem: `O EPI ${detalhes.epi.nome} do colaborador ${nomeColaborador} está vencido desde ${epiAtribuido.validade}.`,
            data: new Date(),
            lida: false,
            epiId: epiAtribuido.id,
            colaboradorId: epiAtribuido.colaboradorId
          });

          // Mostra um toast para EPIs vencidos
          toast.error(`EPI Vencido: ${detalhes.epi.nome}`, {
            description: `Este EPI do colaborador ${nomeColaborador} precisa ser substituído imediatamente.`,
            duration: 5000
          });
        }
        // Se o EPI está próximo ao vencimento (usando diasParaNotificar configurado)
        else if (diasAteVencimento <= diasParaNotificar && diasAteVencimento > 0 && !notificacaoExistente) {
          const colaborador = detalhes.colaborador;
          const nomeColaborador = colaborador?.nome || 'Colaborador não identificado';

          novasNotificacoes.push({
            id: notificacaoId,
            tipo: 'epi_proximo_vencimento',
            titulo: 'EPI Próximo ao Vencimento',
            mensagem: `O EPI ${detalhes.epi.nome} do colaborador ${nomeColaborador} vencerá em ${diasAteVencimento} dias (${epiAtribuido.validade}).`,
            data: new Date(),
            lida: false,
            epiId: epiAtribuido.id,
            colaboradorId: epiAtribuido.colaboradorId
          });

          toast.warning(`EPI Próximo ao Vencimento: ${detalhes.epi.nome}`, {
            description: `Este EPI do colaborador ${nomeColaborador} vencerá em ${diasAteVencimento} dias.`,
            duration: 5000
          });
        }
      });

      if (novasNotificacoes.length > 0) {
        setNotificacoes(prev => [...novasNotificacoes, ...prev]);
      }
    };

    verificarEPIs();
    // Verifica a cada hora
    const interval = setInterval(verificarEPIs, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, [episAtribuidos, getEPIAtribuidoDetalhes, diasParaNotificar, notificacoes]);

  const notificacoesNaoLidas = notificacoes.filter(n => !n.lida).length;

  const marcarComoLida = (id: string) => {
    setNotificacoes(prev =>
      prev.map(n => (n.id === id ? { ...n, lida: true } : n))
    );
  };

  const marcarTodasComoLidas = () => {
    setNotificacoes(prev => prev.map(n => ({ ...n, lida: true })));
  };

  const limparNotificacoes = () => {
    setNotificacoes([]);
  };

  const atualizarPrazoNotificacao = (dias: number) => {
    setDiasParaNotificar(dias);
    localStorage.setItem('diasParaNotificar', dias.toString());
  };

  // Carregar prazo salvo ao iniciar
  useEffect(() => {
    const prazoSalvo = localStorage.getItem('diasParaNotificar');
    if (prazoSalvo) {
      setDiasParaNotificar(parseInt(prazoSalvo));
    }
  }, []);

  return (
    <NotificacoesContext.Provider
      value={{
        notificacoes,
        notificacoesNaoLidas,
        marcarComoLida,
        marcarTodasComoLidas,
        limparNotificacoes,
        atualizarPrazoNotificacao
      }}
    >
      {children}
    </NotificacoesContext.Provider>
  );
};

export const useNotificacoes = () => {
  const context = useContext(NotificacoesContext);
  if (context === undefined) {
    throw new Error('useNotificacoes deve ser usado dentro de um NotificacoesProvider');
  }
  return context;
}; 