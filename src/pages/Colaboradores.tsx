import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { UserPlus, Pencil, AlertTriangle, CheckCircle, Clock, List, ArrowUpDown } from 'lucide-react';
import AdicionarColaboradorModal from '../components/AdicionarColaboradorModal';
import EditarColaboradorModal from '../components/EditarColaboradorModal';
import { useToast } from '@/hooks/use-toast';
import { useEPI, EPIAtribuido } from '../contexts/EPIContext';
import DetalhesEPIColaboradorModal from '../components/DetalhesEPIColaboradorModal';

interface Colaborador {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: 'ativo' | 'afastado' | 'férias';
  marina: string;
}

const Colaboradores = () => {
  const { toast } = useToast();
  const { 
    epis, 
    setEpis, 
    episAtribuidos, 
    getEPIsDoColaborador, 
    getEPIAtribuidoDetalhes 
  } = useEPI();
  
  const [colaboradores, setColaboradores] = useState<Colaborador[]>(() => {
    const savedColaboradores = localStorage.getItem('colaboradores');
    return savedColaboradores ? JSON.parse(savedColaboradores) : [];
  });

  // Salva os colaboradores no localStorage sempre que houver mudanças
  useEffect(() => {
    localStorage.setItem('colaboradores', JSON.stringify(colaboradores));
  }, [colaboradores]);

  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [colaboradorParaEditar, setColaboradorParaEditar] = useState<Colaborador | null>(null);
  const [termoBusca, setTermoBusca] = useState('');
  const [modalDetalhesAberto, setModalDetalhesAberto] = useState(false);
  const [colaboradorParaDetalhes, setColaboradorParaDetalhes] = useState<Colaborador | null>(null);

  const [ordenacao, setOrdenacao] = useState<{
    campo: keyof Colaborador | '';
    direcao: 'asc' | 'desc';
  }>({
    campo: '',
    direcao: 'asc'
  });

  const ordenarColaboradores = (colaboradores: Colaborador[]) => {
    if (!ordenacao.campo) return colaboradores;

    return [...colaboradores].sort((a, b) => {
      const valorA = a[ordenacao.campo];
      const valorB = b[ordenacao.campo];

      if (valorA < valorB) return ordenacao.direcao === 'asc' ? -1 : 1;
      if (valorA > valorB) return ordenacao.direcao === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const alternarOrdenacao = (campo: keyof Colaborador) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  const colaboradoresFiltrados = ordenarColaboradores(
    colaboradores.filter(c => 
      c.nome.toLowerCase().includes(termoBusca.toLowerCase()) || 
      c.departamento.toLowerCase().includes(termoBusca.toLowerCase()) ||
      c.cargo.toLowerCase().includes(termoBusca.toLowerCase()) ||
      (c.marina && c.marina.toLowerCase().includes(termoBusca.toLowerCase()))
    )
  );

  // Atualiza os colaboradores para adicionar EPIs iniciais para fins de demonstração
  useEffect(() => {
    // Inicializa alguns EPIs atribuídos para demonstração, se não existirem ainda
    if (episAtribuidos.length === 0) {
      // A lógica de atribuição será feita no modal de edição
    }
  }, []);

  const adicionarColaborador = (novoColaborador: Omit<Colaborador, 'id'>) => {
    const novoId = Math.max(0, ...colaboradores.map(c => c.id)) + 1;
    const colaboradorCompleto = { ...novoColaborador, id: novoId };
    setColaboradores([...colaboradores, colaboradorCompleto]);
    setModalAdicionarAberto(false);
    
    toast({
      title: "Colaborador adicionado",
      description: `${novoColaborador.nome} foi adicionado com sucesso.`,
    });
    
    return colaboradorCompleto.id; // Retornar o ID para uso nos componentes
  };

  const editarColaborador = (colaboradorEditado: Colaborador) => {
    setColaboradores(colaboradores.map(c => 
      c.id === colaboradorEditado.id ? colaboradorEditado : c
    ));
    
    setModalEditarAberto(false);
    setColaboradorParaEditar(null);
    
    toast({
      title: "Colaborador atualizado",
      description: `${colaboradorEditado.nome} foi atualizado com sucesso.`,
    });
  };

  const abrirModalEditar = (colaborador: Colaborador) => {
    setColaboradorParaEditar(colaborador);
    setModalEditarAberto(true);
  };

  const abrirModalDetalhes = (colaborador: Colaborador) => {
    setColaboradorParaDetalhes(colaborador);
    setModalDetalhesAberto(true);
  };

  const getEPIsAtribuidosAoColaborador = (colaboradorId: number) => {
    return getEPIsDoColaborador(colaboradorId);
  };

  const getEPIDetalhes = (epiAtribuido: EPIAtribuido) => {
    const detalhes = getEPIAtribuidoDetalhes(epiAtribuido.id);
    return detalhes?.epi.nome || "EPI não encontrado";
  };

  const getStatusIcon = (status: EPIAtribuido['status']) => {
    switch (status) {
      case 'vencido':
        return <AlertTriangle size={14} className="text-red-500" />;
      case 'proximo_vencimento':
        return <Clock size={14} className="text-amber-500" />;
      case 'ativo':
        return <CheckCircle size={14} className="text-green-500" />;
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
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const excluirColaborador = (colaboradorId: number) => {
    setColaboradores(prev => prev.filter(col => col.id !== colaboradorId));
    
    toast({
      title: "Colaborador excluído",
      description: "O colaborador foi excluído com sucesso.",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6 font-sans">
      <Header />
      <Navigation />
      
      <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Colaboradores</h1>
          <Button onClick={() => setModalAdicionarAberto(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3">
            <UserPlus size={24} />
            Adicionar Colaborador
          </Button>
        </div>
        
        <div className="mb-8">
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Buscar por nome, cargo ou departamento..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full text-lg py-6 px-4"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 border-b-2 border-gray-200">
                <TableHead 
                  className="text-lg font-bold text-gray-800 py-4 text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => alternarOrdenacao('nome')}
                >
                  <div className="flex items-center justify-center gap-2">
                    Nome
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => alternarOrdenacao('marina')}
                >
                  <div className="flex items-center justify-center gap-2">
                    Marina
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => alternarOrdenacao('cargo')}
                >
                  <div className="flex items-center justify-center gap-2">
                    Cargo
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => alternarOrdenacao('departamento')}
                >
                  <div className="flex items-center justify-center gap-2">
                    Departamento
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => alternarOrdenacao('dataAdmissao')}
                >
                  <div className="flex items-center justify-center gap-2">
                    Data de Admissão
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead 
                  className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => alternarOrdenacao('status')}
                >
                  <div className="flex items-center justify-center gap-2">
                    Status
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead className="text-lg font-bold text-gray-800 text-center">EPIs Atribuídos</TableHead>
                <TableHead className="text-lg font-bold text-gray-800 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colaboradoresFiltrados.map((colaborador, index) => (
                <TableRow 
                  key={colaborador.id} 
                  className={`text-base ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}
                >
                  <TableCell className="text-center">
                    <div className="font-bold text-lg text-gray-900">{colaborador.nome}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold text-base text-gray-900">{colaborador.marina || 'Não definida'}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold text-base text-gray-900">{colaborador.cargo}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold text-base text-gray-900">{colaborador.departamento}</div>
                  </TableCell>
                  <TableCell className="text-center font-semibold text-base text-gray-900">{colaborador.dataAdmissao}</TableCell>
                  <TableCell className="text-center">
                    <span className={`px-3 py-1 rounded-full text-base font-semibold ${
                      colaborador.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : colaborador.status === 'férias'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {colaborador.status.charAt(0).toUpperCase() + colaborador.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                      {getEPIsAtribuidosAoColaborador(colaborador.id).map((epiAtribuido) => {
                        const epiNome = getEPIDetalhes(epiAtribuido);
                        return (
                          <span 
                            key={epiAtribuido.id}
                            className={`inline-flex items-center gap-1 text-base px-3 py-1 rounded-full font-semibold ${getStatusClass(epiAtribuido.status)}`}
                            title={`Atribuído em: ${epiAtribuido.dataAtribuicao} - Validade: ${epiAtribuido.validade}`}
                          >
                            {getStatusIcon(epiAtribuido.status)}
                            {epiNome}
                          </span>
                        );
                      })}
                      {getEPIsAtribuidosAoColaborador(colaborador.id).length === 0 && (
                        <span className="font-semibold text-base text-gray-900">Nenhum EPI atribuído</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="lg" 
                        onClick={() => abrirModalDetalhes(colaborador)}
                        className="h-10 w-10 p-0 hover:bg-blue-100"
                        title="Ver detalhes dos EPIs"
                      >
                        <List size={20} className="text-gray-600" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="lg" 
                        onClick={() => abrirModalEditar(colaborador)}
                        className="h-10 w-10 p-0 hover:bg-blue-100"
                        title="Editar colaborador"
                      >
                        <Pencil size={20} className="text-gray-600" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {modalAdicionarAberto && (
        <AdicionarColaboradorModal 
          isOpen={modalAdicionarAberto}
          onClose={() => setModalAdicionarAberto(false)}
          onAdicionar={adicionarColaborador}
        />
      )}

      {modalEditarAberto && colaboradorParaEditar && (
        <EditarColaboradorModal 
          isOpen={modalEditarAberto}
          onClose={() => {
            setModalEditarAberto(false);
            setColaboradorParaEditar(null);
          }}
          onSalvar={editarColaborador}
          onExcluir={excluirColaborador}
          colaborador={colaboradorParaEditar}
        />
      )}
      
      {modalDetalhesAberto && colaboradorParaDetalhes && (
        <DetalhesEPIColaboradorModal
          isOpen={modalDetalhesAberto}
          onClose={() => setModalDetalhesAberto(false)}
          colaborador={colaboradorParaDetalhes}
        />
      )}
    </div>
  );
};

export default Colaboradores;
