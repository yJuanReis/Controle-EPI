import React, { useState, useEffect, useMemo } from 'react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Eye, Download, Filter, Info, RotateCcw, Share2, Calendar, User, Package, Hash, ArrowUpDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Header from '@/components/Header';
import Navigation from '@/components/Navigation';
import { useEPI, EPIAtribuido } from '@/contexts/EPIContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DatePicker } from "@/components/ui/date-picker";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Função para obter classe CSS para status
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
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

// Função para formatar status para exibição
const formatarStatus = (status: EPIAtribuido['status']) => {
  switch (status) {
    case 'vencido': return 'Vencido';
    case 'proximo_vencimento': return 'Próximo ao Vencimento';
    case 'ativo': return 'Ativo';
    case 'devolvido': return 'Devolvido';
    case 'baixado': return 'Baixado';
    default: return status;
  }
};

// Interface para movimentação combinada (entrega ou devolução)
interface Movimentacao {
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
  responsavel?: string; // Quem realizou a movimentação
  detalhes?: {
    statusAnterior?: string;
    motivoBaixa?: string;
    validadeAnterior?: string;
    validadeNova?: string;
  };
}

// Interface para o colaborador
interface Colaborador {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: 'ativo' | 'afastado' | 'férias';
}

// Interface para o EPI devolvido
interface EPIDevolvido {
  id: string;
  epiId: number;
  colaboradorId: number;
  dataAtribuicao: string;
  dataDevolucao: string;
  observacoes?: string;
}

// Componente para mostrar detalhes da movimentação
const DetalhesMovimentacaoDialog = ({ movimentacao }: { movimentacao: Movimentacao }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="ghost" size="icon" className="h-8 w-8">
        <Info size={16} />
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[500px]">
      <DialogHeader>
        <DialogTitle>Detalhes da Movimentação</DialogTitle>
        <DialogDescription>
          {movimentacao.tipo === 'atribuicao' ? 'Entrega' : 
           movimentacao.tipo === 'devolucao' ? 'Devolução' : 
           movimentacao.tipo === 'vencimento' ? 'Vencimento' : 
           movimentacao.tipo === 'baixa' ? 'Baixa' : 'Atualização'} de EPI
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 pt-4">
        <div className="flex items-center gap-2 text-sm">
          <Hash className="h-4 w-4 text-gray-500" />
          <span className="font-medium">ID:</span> 
          <span className="font-mono">{movimentacao.id}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Data:</span> 
          <span>{movimentacao.data}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium">Colaborador:</span> 
          <span>{movimentacao.colaboradorNome}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Package className="h-4 w-4 text-gray-500" />
          <span className="font-medium">EPI:</span> 
          <span>{movimentacao.epiNome}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">C.A.:</span> 
          <span>{movimentacao.epiCA}</span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Status:</span>
          <span className={`py-1 px-2 rounded-full text-xs ${getStatusClass(movimentacao.status)}`}>
            {formatarStatus(movimentacao.status)}
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <span className="font-medium">Responsável:</span>
          <span>{movimentacao.responsavel || 'Não informado'}</span>
        </div>
        {movimentacao.observacoes && (
          <div className="flex items-start gap-2 text-sm">
            <span className="font-medium">Observações:</span>
            <span>{movimentacao.observacoes}</span>
          </div>
        )}
        {movimentacao.detalhes && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-sm font-medium mb-2">Detalhes adicionais:</div>
            {movimentacao.detalhes.statusAnterior && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Status anterior:</span>
                <span>{formatarStatus(movimentacao.detalhes.statusAnterior as any)}</span>
              </div>
            )}
            {movimentacao.detalhes.motivoBaixa && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Motivo da baixa:</span>
                <span>{movimentacao.detalhes.motivoBaixa}</span>
              </div>
            )}
            {movimentacao.detalhes.validadeAnterior && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Validade anterior:</span>
                <span>{movimentacao.detalhes.validadeAnterior}</span>
              </div>
            )}
            {movimentacao.detalhes.validadeNova && (
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Nova validade:</span>
                <span>{movimentacao.detalhes.validadeNova}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </DialogContent>
  </Dialog>
);

const EntregasDevolucoes = () => {
  const { epis, episAtribuidos, episDevolvidos, movimentacoes, setMovimentacoes } = useEPI();
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroColaborador, setFiltroColaborador] = useState<string>("");
  const [filtroEPI, setFiltroEPI] = useState<string>("");
  const [filtroStatus, setFiltroStatus] = useState<string>("todos");
  const [dataInicial, setDataInicial] = useState<Date | undefined>(undefined);
  const [dataFinal, setDataFinal] = useState<Date | undefined>(undefined);
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  
  // Adicionar estado para paginação
  const [paginaAtual, setPaginaAtual] = useState(1);
  const itensPorPagina = 10;

  // Carregar colaboradores do localStorage na inicialização
  useEffect(() => {
    const colaboradoresStorage = localStorage.getItem('colaboradores');
    if (colaboradoresStorage) {
      setColaboradores(JSON.parse(colaboradoresStorage));
    }
  }, []);

  // Aplicar filtros às movimentações
  const movimentacoesFiltradas = movimentacoes.filter(mov => {
    // Filtro por tipo
    if (filtroTipo !== "todos" && mov.tipo !== filtroTipo) return false;
    
    // Filtro por colaborador
    if (filtroColaborador && !mov.colaboradorNome.toLowerCase().includes(filtroColaborador.toLowerCase())) return false;
    
    // Filtro por EPI
    if (filtroEPI && !mov.epiNome.toLowerCase().includes(filtroEPI.toLowerCase())) return false;
    
    // Filtro por status
    if (filtroStatus !== "todos" && mov.status !== filtroStatus) return false;
    
    // Filtro por data inicial
    if (dataInicial) {
      const dataMovPartes = mov.data.split('/').map(Number);
      const dataMov = new Date(dataMovPartes[2], dataMovPartes[1] - 1, dataMovPartes[0]);
      if (dataMov < dataInicial) return false;
    }
    
    // Filtro por data final
    if (dataFinal) {
      const dataMovPartes = mov.data.split('/').map(Number);
      const dataMov = new Date(dataMovPartes[2], dataMovPartes[1] - 1, dataMovPartes[0]);
      if (dataMov > dataFinal) return false;
    }
    
    return true;
  });

  // Aplicar paginação às movimentações filtradas
  const movimentacoesPaginadas = useMemo(() => {
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const fim = inicio + itensPorPagina;
    return movimentacoesFiltradas.slice(inicio, fim);
  }, [movimentacoesFiltradas, paginaAtual]);

  const totalPaginas = Math.ceil(movimentacoesFiltradas.length / itensPorPagina);

  // Função para exportar dados filtrados para CSV
  const exportarCSV = () => {
    if (movimentacoesFiltradas.length === 0) return;
    
    const cabecalho = "ID;Tipo;Data;Colaborador;EPI;CA;Status;Responsável;Observações\n";
    const linhas = movimentacoesFiltradas.map(mov => 
      `${mov.id};${mov.tipo === 'atribuicao' ? 'Entrega' : mov.tipo === 'devolucao' ? 'Devolução' : mov.tipo === 'vencimento' ? 'Vencimento' : mov.tipo === 'baixa' ? 'Baixa' : 'Atualização'};${mov.data};${mov.colaboradorNome};${mov.epiNome};${mov.epiCA};${mov.status};${mov.responsavel || ''};${mov.observacoes || ''}`
    ).join('\n');
    
    const conteudoCSV = cabecalho + linhas;
    const blob = new Blob([conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `movimentacoes_epi_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Função para limpar todos os filtros
  const limparFiltros = () => {
    setFiltroTipo("todos");
    setFiltroColaborador("");
    setFiltroEPI("");
    setFiltroStatus("todos");
    setDataInicial(undefined);
    setDataFinal(undefined);
  };

  const Paginacao = () => (
    <div className="flex items-center justify-between px-2 py-4">
      <div className="flex w-[100px] items-center justify-center text-sm font-medium">
        Página {paginaAtual} de {totalPaginas}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPaginaAtual(p => Math.max(1, p - 1))}
          disabled={paginaAtual === 1}
        >
          Anterior
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setPaginaAtual(p => Math.min(totalPaginas, p + 1))}
          disabled={paginaAtual === totalPaginas}
        >
          Próxima
        </Button>
      </div>
    </div>
  );

  const [ordenacao, setOrdenacao] = useState<{ campo: string; direcao: 'asc' | 'desc' }>({ campo: 'dataDevolucao', direcao: 'asc' });

  const alternarOrdenacao = (campo: string) => {
    if (ordenacao.campo === campo) {
      setOrdenacao({ ...ordenacao, direcao: ordenacao.direcao === 'asc' ? 'desc' : 'asc' });
    } else {
      setOrdenacao({ campo, direcao: 'asc' });
    }
  };

  const abrirDetalhes = (movimentacao: Movimentacao) => {
    // Implemente a lógica para abrir o modal de detalhes com a movimentação selecionada
  };

  return (
    <div className="w-full p-6 bg-gray-50 font-sans min-h-screen">
      <Header />
      <Navigation />
      
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Movimentações de EPIs</h1>
          <p className="text-gray-600">Histórico de entregas e devoluções de EPIs para colaboradores</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2" onClick={exportarCSV}>
            <Download size={16} />
            Exportar CSV
        </Button>
        </div>
      </div>
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter size={18} />
            Filtros
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo</label>
              <Select value={filtroTipo} onValueChange={setFiltroTipo}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tipo de movimentação" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="atribuicao">Entrega</SelectItem>
                  <SelectItem value="devolucao">Devolução</SelectItem>
                  <SelectItem value="vencimento">Vencimento</SelectItem>
                  <SelectItem value="perda">Perda</SelectItem>
                  <SelectItem value="baixa">Baixa</SelectItem>
                  <SelectItem value="atualizacao">Atualização</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <Select value={filtroStatus} onValueChange={setFiltroStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Todos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="proximo_vencimento">Próximo ao Vencimento</SelectItem>
                  <SelectItem value="vencido">Vencido</SelectItem>
                  <SelectItem value="devolvido">Devolvido</SelectItem>
                  <SelectItem value="baixado">Baixado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Inicial</label>
              <DatePicker date={dataInicial} setDate={setDataInicial} placeholder="Data inicial" />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Final</label>
              <DatePicker date={dataFinal} setDate={setDataFinal} placeholder="Data final" />
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Colaborador</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Search size={16} />
                </div>
                <Input 
                  type="text" 
                  placeholder="Buscar colaborador"
                  value={filtroColaborador}
                  onChange={(e) => setFiltroColaborador(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="col-span-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">EPI</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                  <Search size={16} />
                </div>
                <Input 
                  type="text" 
                  placeholder="Buscar EPI"
                  value={filtroEPI}
                  onChange={(e) => setFiltroEPI(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button 
              variant="outline" 
              className="flex items-center gap-2" 
              onClick={limparFiltros}
            >
              <RotateCcw size={16} />
              Limpar Filtros
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Histórico de Movimentações</CardTitle>
          <CardDescription>
            Resultados: {movimentacoesFiltradas.length} movimentações encontradas
            (Mostrando {Math.min(itensPorPagina, movimentacoesPaginadas.length)} por página)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">EPIs Devolvidos</h3>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 border-b-2 border-gray-200">
                    <TableHead 
                      className="text-lg font-bold text-gray-800 py-4 text-center cursor-pointer hover:bg-gray-200"
                      onClick={() => alternarOrdenacao('dataDevolucao')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Data Devolução
                        <ArrowUpDown size={16} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                      onClick={() => alternarOrdenacao('dataAtribuicao')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Data Atribuição
                        <ArrowUpDown size={16} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                      onClick={() => alternarOrdenacao('colaborador')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Colaborador
                        <ArrowUpDown size={16} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                      onClick={() => alternarOrdenacao('epi')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        EPI
                        <ArrowUpDown size={16} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                      onClick={() => alternarOrdenacao('observacoes')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Observações
                        <ArrowUpDown size={16} />
                      </div>
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {episDevolvidos.map((epiDevolvido, index) => {
                    const colaborador = colaboradores.find(c => c.id === epiDevolvido.colaboradorId);
                    const epi = epis.find(e => e.id === epiDevolvido.epiId);
                    
                    if (!colaborador || !epi) return null;
                    
                    return (
                      <TableRow 
                        key={epiDevolvido.id}
                        className={`text-base ${index % 2 === 0 ? 'bg-white' : 'bg-amber-50'} hover:bg-amber-100 transition-colors`}
                      >
                        <TableCell className="text-center">
                          <div className="font-semibold text-base text-gray-900">{epiDevolvido.dataDevolucao}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="font-semibold text-base text-gray-900">{epiDevolvido.dataAtribuicao}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="font-bold text-lg text-gray-900">{colaborador.nome}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="font-bold text-lg text-gray-900">{epi.nome}</div>
                        </TableCell>
                        <TableCell className="text-center">
                          <div className="font-semibold text-base text-gray-900">{epiDevolvido.observacoes || '-'}</div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {episDevolvidos.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                        Nenhum EPI devolvido encontrado
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-800 mt-12 mb-6">Todas as Movimentações</h3>
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-100 border-b-2 border-gray-200">
                    <TableHead 
                      className="text-lg font-bold text-gray-800 py-4 text-center cursor-pointer hover:bg-gray-200"
                      onClick={() => alternarOrdenacao('id')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        ID
                        <ArrowUpDown size={16} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                      onClick={() => alternarOrdenacao('tipo')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Tipo
                        <ArrowUpDown size={16} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                      onClick={() => alternarOrdenacao('data')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Data
                        <ArrowUpDown size={16} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                      onClick={() => alternarOrdenacao('colaboradorNome')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        Colaborador
                        <ArrowUpDown size={16} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                      onClick={() => alternarOrdenacao('epiNome')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        EPI
                        <ArrowUpDown size={16} />
                      </div>
                    </TableHead>
                    <TableHead 
                      className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                      onClick={() => alternarOrdenacao('epiCA')}
                    >
                      <div className="flex items-center justify-center gap-2">
                        C.A.
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
                    <TableHead className="text-lg font-bold text-gray-800 text-center">Detalhes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movimentacoesPaginadas.map((mov, index) => (
                    <TableRow 
                      key={mov.id} 
                      className={`text-base ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}
                    >
                      <TableCell className="text-center">
                        <div className="font-mono text-sm text-gray-900">{mov.id.substring(0, 8)}...</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-3 py-1 rounded-full text-base font-semibold ${
                          mov.tipo === 'atribuicao' ? 'bg-green-100 text-green-800' : 
                          mov.tipo === 'devolucao' ? 'bg-amber-100 text-amber-800' : 
                          mov.tipo === 'vencimento' ? 'bg-red-100 text-red-800' : 
                          mov.tipo === 'perda' ? 'bg-purple-100 text-purple-800' : 
                          mov.tipo === 'baixa' ? 'bg-gray-100 text-gray-800' : 
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {mov.tipo === 'atribuicao' ? 'Entrega' : 
                           mov.tipo === 'devolucao' ? 'Devolução' : 
                           mov.tipo === 'vencimento' ? 'Vencimento' : 
                           mov.tipo === 'perda' ? 'Perda' :
                           mov.tipo === 'baixa' ? 'Baixa' : 'Atualização'}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold text-base text-gray-900">{mov.data}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-bold text-lg text-gray-900">{mov.colaboradorNome}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-bold text-lg text-gray-900">{mov.epiNome}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold text-base text-gray-900">{mov.epiCA}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-3 py-1 rounded-full text-base font-semibold ${getStatusClass(mov.status)}`}>
                          {formatarStatus(mov.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="lg"
                            className="h-10 w-10 p-0 hover:bg-blue-100"
                            onClick={() => abrirDetalhes(mov)}
                          >
                            <Eye size={20} className="text-gray-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Paginacao />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EntregasDevolucoes;
