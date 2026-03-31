import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { TableHeader, TableRow, TableHead, TableBody, TableCell, Table } from '@/components/ui/table';
import { useEPI, EPIAtribuido } from '../contexts/EPIContext';
import { AlertTriangle, Clock, CheckCircle, ArrowDownUp } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Colaborador {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: 'ativo' | 'afastado' | 'férias' | 'baixado';
  marina: string;
}

interface EPIDetalhado {
  id: string;
  epiId: number;
  nome: string;
  ca: string;
  validade: string;
  dataAtribuicao: string;
  status: 'ativo' | 'vencido' | 'proximo_vencimento' | 'devolvido' | 'baixado';
  valorUn: number;
}

interface DetalhesEPIColaboradorModalProps {
  isOpen: boolean;
  onClose: () => void;
  colaborador: Colaborador;
}

const DetalhesEPIColaboradorModal = ({ isOpen, onClose, colaborador }: DetalhesEPIColaboradorModalProps) => {
  const { getEPIsDoColaborador, getEPIAtribuidoDetalhes, devolverEPI, atualizarEPIAtribuido } = useEPI();
  const [episAtribuidos, setEpisAtribuidos] = useState<EPIDetalhado[]>([]);
  const [filtro, setFiltro] = useState('');
  const [ordenacao, setOrdenacao] = useState<{ campo: keyof EPIDetalhado; crescente: boolean }>({
    campo: 'dataAtribuicao',
    crescente: false
  });

  useEffect(() => {
    const carregarEPIs = () => {
      const episDoColaborador = getEPIsDoColaborador(colaborador.id);
      
      const detalhesEpis = episDoColaborador.map(epiAtribuido => {
        const detalhes = getEPIAtribuidoDetalhes(epiAtribuido.id);
        if (!detalhes) return null;
        
        return {
          id: epiAtribuido.id,
          epiId: detalhes.epi.id,
          nome: detalhes.epi.nome,
          ca: detalhes.epi.ca,
          validade: epiAtribuido.validade,
          dataAtribuicao: epiAtribuido.dataAtribuicao,
          status: epiAtribuido.status,
          valorUn: detalhes.epi.valorUn
        };
      }).filter((epi): epi is EPIDetalhado => epi !== null);
      
      setEpisAtribuidos(detalhesEpis);
    };
    
    carregarEPIs();
  }, [colaborador.id, getEPIsDoColaborador, getEPIAtribuidoDetalhes]);

  const handleDevolverEPI = (epiAtribuidoId: string) => {
    const observacoes = window.prompt("Por favor, descreva o motivo da devolução (opcional):");
    devolverEPI(epiAtribuidoId, observacoes || undefined);
    // Atualiza a lista removendo o EPI devolvido
    setEpisAtribuidos(prev => prev.filter(epi => epi.id !== epiAtribuidoId));
  };

  const atualizarValidadeEPI = (epiAtribuidoId: string, novaValidade: string) => {
    // Atualiza no estado local
    setEpisAtribuidos(prev => 
      prev.map(epi => 
        epi.id === epiAtribuidoId 
          ? { ...epi, validade: novaValidade }
          : epi
      )
    );
    
    // Busca o EPI atribuído original
    const epiAtribuido = getEPIsDoColaborador(colaborador.id).find(epi => epi.id === epiAtribuidoId);
    
    if (epiAtribuido) {
      // Atualiza no context
      atualizarEPIAtribuido({
        ...epiAtribuido,
        validade: novaValidade
      });
    }
  };

  const ordenar = (campo: keyof EPIDetalhado) => {
    setOrdenacao(prev => ({
      campo,
      crescente: prev.campo === campo ? !prev.crescente : true
    }));
  };

  const getStatusIcon = (status: EPIAtribuido['status']) => {
    switch (status) {
      case 'vencido':
        return <AlertTriangle size={16} className="text-red-500" />;
      case 'proximo_vencimento':
        return <Clock size={16} className="text-amber-500" />;
      case 'ativo':
        return <CheckCircle size={16} className="text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusClass = (status: EPIAtribuido['status']) => {
    switch (status) {
      case 'vencido':
        return "bg-red-100 text-red-800";
      case 'proximo_vencimento':
        return "bg-amber-100 text-amber-800";
      case 'ativo':
        return "bg-green-100 text-green-800";
      case 'devolvido':
        return "bg-gray-100 text-gray-800";
      case 'baixado':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusLabel = (status: EPIAtribuido['status']) => {
    switch (status) {
      case 'vencido':
        return "Vencido";
      case 'proximo_vencimento':
        return "Próximo ao vencimento";
      case 'ativo':
        return "Ativo";
      case 'devolvido':
        return "Devolvido";
      case 'baixado':
        return "Baixado";
      default:
        return "Desconhecido";
    }
  };

  // Filtra e ordena os EPIs
  const episFiltrados = episAtribuidos
    .filter(epi => 
      epi.nome.toLowerCase().includes(filtro.toLowerCase()) ||
      epi.ca.toLowerCase().includes(filtro.toLowerCase())
    )
    .sort((a, b) => {
      const campo = ordenacao.campo;
      
      if (typeof a[campo] === 'string' && typeof b[campo] === 'string') {
        const result = (a[campo] as string).localeCompare(b[campo] as string);
        return ordenacao.crescente ? result : -result;
      }
      
      if (typeof a[campo] === 'number' && typeof b[campo] === 'number') {
        const result = a[campo] > b[campo] ? 1 : -1;
        return ordenacao.crescente ? result : -result;
      }
      
      return 0;
    });
  
  const incluirTodos = filtro.trim() === '';
  const episExibidos = incluirTodos ? episFiltrados : episFiltrados.filter(epi => 
    epi.status !== 'devolvido' && epi.status !== 'baixado'
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            EPIs de {colaborador.nome}
          </DialogTitle>
          <div className="text-sm text-gray-500">
            {colaborador.cargo} - {colaborador.departamento} - {colaborador.marina}
          </div>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="filtro">Buscar EPIs</Label>
            <Input
              id="filtro"
              placeholder="Buscar por nome, CA, tipo..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
            />
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="mostrarTodos"
                checked={incluirTodos}
                onChange={() => setFiltro(filtro.trim() === '' ? ' ' : '')}
                className="rounded text-primary-600 focus:ring-primary-500"
              />
              <Label htmlFor="mostrarTodos" className="text-sm cursor-pointer">
                Mostrar todos os EPIs (incluindo devolvidos e baixados)
              </Label>
            </div>
          </div>

          <div className="rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => ordenar('nome')}
                  >
                    <div className="flex items-center gap-2">
                      Nome
                      <ArrowDownUp size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => ordenar('valorUn')}
                  >
                    <div className="flex items-center gap-2">
                      Valor UN
                      <ArrowDownUp size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => ordenar('ca')}
                  >
                    <div className="flex items-center gap-2">
                      C.A.
                      <ArrowDownUp size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => ordenar('dataAtribuicao')}
                  >
                    <div className="flex items-center gap-2">
                      Data Atribuição
                      <ArrowDownUp size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => ordenar('validade')}
                  >
                    <div className="flex items-center gap-2">
                      Validade
                      <ArrowDownUp size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer hover:bg-gray-200"
                    onClick={() => ordenar('status')}
                  >
                    <div className="flex items-center gap-2">
                      Status
                      <ArrowDownUp size={16} />
                    </div>
                  </TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {episExibidos.map((epi) => (
                  <TableRow key={epi.id}>
                    <TableCell>{epi.nome}</TableCell>
                    <TableCell>R$ {epi.valorUn.toFixed(2)}</TableCell>
                    <TableCell>{epi.ca}</TableCell>
                    <TableCell>{epi.dataAtribuicao}</TableCell>
                    <TableCell>{epi.validade}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusClass(epi.status)}`}>
                        {getStatusIcon(epi.status)}
                        {getStatusLabel(epi.status)}
                      </span>
                    </TableCell>
                    <TableCell>
                      {epi.status !== 'devolvido' && epi.status !== 'baixado' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDevolverEPI(epi.id)}
                          className="text-gray-600 hover:text-red-600"
                        >
                          Devolver
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {episExibidos.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-4 text-gray-500">
                      Nenhum EPI encontrado
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DetalhesEPIColaboradorModal; 