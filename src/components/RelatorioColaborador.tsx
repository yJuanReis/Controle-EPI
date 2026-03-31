import React, { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Download, User, Package, Calendar, AlertTriangle, CheckCircle, Clock, ArrowUpDown } from "lucide-react";
import { useEPI } from '@/contexts/EPIContext';

interface RelatorioColaboradorProps {
  colaborador: {
    id: number;
    nome: string;
    cargo: string;
    departamento: string;
    dataAdmissao: string;
    status: 'ativo' | 'afastado' | 'férias';
  };
}

interface Movimentacao {
  id: string;
  tipo: 'atribuicao' | 'devolucao' | 'vencimento' | 'baixa' | 'atualizacao' | 'perda';
  data: string;
  epiNome: string;
  epiCA: string;
  status: 'ativo' | 'vencido' | 'proximo_vencimento' | 'devolvido' | 'baixado';
  responsavel?: string;
}

const RelatorioColaborador = ({ colaborador }: RelatorioColaboradorProps) => {
  const { getMovimentacoesColaborador } = useEPI();

  const [ordenacao, setOrdenacao] = useState<{
    campo: keyof Movimentacao;
    direcao: 'asc' | 'desc';
  }>({
    campo: 'data',
    direcao: 'desc'
  });

  const alternarOrdenacao = (campo: keyof Movimentacao) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  // Usar o cache de movimentações
  const movimentacoesColaborador = useMemo(() => {
    return getMovimentacoesColaborador(colaborador.id).sort((a, b) => {
      const dataA = new Date(a.data.split('/').reverse().join('-'));
      const dataB = new Date(b.data.split('/').reverse().join('-'));
      return dataB.getTime() - dataA.getTime();
    });
  }, [colaborador.id, getMovimentacoesColaborador]);

  const movimentacoesOrdenadas = [...movimentacoesColaborador].sort((a, b) => {
    const valorA = a[ordenacao.campo];
    const valorB = b[ordenacao.campo];

    if (valorA < valorB) return ordenacao.direcao === 'asc' ? -1 : 1;
    if (valorA > valorB) return ordenacao.direcao === 'asc' ? 1 : -1;
    return 0;
  });

  // Calcular estatísticas usando o cache
  const estatisticas = useMemo(() => ({
    totalEPIs: movimentacoesColaborador.filter(mov => mov.tipo === 'atribuicao').length,
    episAtivos: movimentacoesColaborador.filter(mov => mov.status === 'ativo').length,
    episVencidos: movimentacoesColaborador.filter(mov => mov.status === 'vencido').length,
    episProximosVencimento: movimentacoesColaborador.filter(mov => mov.status === 'proximo_vencimento').length,
    ultimaMovimentacao: movimentacoesColaborador[0]?.data || 'Sem movimentações'
  }), [movimentacoesColaborador]);

  const getStatusIcon = (status: string) => {
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

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'vencido':
        return "bg-red-100 text-red-800";
      case 'proximo_vencimento':
        return "bg-amber-100 text-amber-800";
      case 'ativo':
        return "bg-green-100 text-green-800";
      case 'devolvido':
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const exportarRelatorioCSV = () => {
    if (movimentacoesColaborador.length === 0) return;
    
    const cabecalho = "Data;Tipo;EPI;CA;Status;Responsável;Observações\n";
    const linhas = movimentacoesColaborador.map(mov => 
      `${mov.data};${mov.tipo};${mov.epiNome};${mov.epiCA};${mov.status};${mov.responsavel || ''};${mov.observacoes || ''}`
    ).join('\n');
    
    const conteudoCSV = cabecalho + linhas;
    const blob = new Blob([conteudoCSV], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_${colaborador.nome.toLowerCase().replace(' ', '_')}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
          <CardTitle className="text-xl flex items-center gap-2">
            <User size={20} className="text-primary-500" />
            {colaborador.nome}
          </CardTitle>
          <CardDescription>
            {colaborador.cargo} - {colaborador.departamento}
          </CardDescription>
        </div>
        <Button variant="outline" onClick={exportarRelatorioCSV} className="flex items-center gap-2">
          <Download size={16} />
          Exportar Relatório
        </Button>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card className="p-4">
            <div className="text-sm text-gray-500">Total de EPIs</div>
            <div className="text-2xl font-bold">{estatisticas.totalEPIs}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">EPIs Ativos</div>
            <div className="text-2xl font-bold text-green-600">{estatisticas.episAtivos}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">EPIs Vencidos</div>
            <div className="text-2xl font-bold text-red-600">{estatisticas.episVencidos}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Próximos ao Vencimento</div>
            <div className="text-2xl font-bold text-amber-600">{estatisticas.episProximosVencimento}</div>
          </Card>
          <Card className="p-4">
            <div className="text-sm text-gray-500">Última Movimentação</div>
            <div className="text-lg font-medium">{estatisticas.ultimaMovimentacao}</div>
          </Card>
        </div>

        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100 border-b-2 border-gray-200">
                <TableHead 
                  className="text-lg font-bold text-gray-800 py-4 text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => alternarOrdenacao('data')}
                >
                  <div className="flex items-center justify-center gap-2">
                    Data
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
                <TableHead 
                  className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => alternarOrdenacao('responsavel')}
                >
                  <div className="flex items-center justify-center gap-2">
                    Responsável
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {movimentacoesOrdenadas.map((mov, index) => (
                <TableRow 
                  key={mov.id}
                  className={`text-base ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}
                >
                  <TableCell className="text-center">
                    <div className="font-semibold text-base text-gray-900">{mov.data}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="flex items-center justify-center gap-1">
                      <Package size={16} className="text-gray-500" />
                      <div className="font-semibold text-base text-gray-900">
                        {mov.tipo === 'atribuicao' ? 'Entrega' : 
                         mov.tipo === 'devolucao' ? 'Devolução' : 
                         mov.tipo === 'vencimento' ? 'Vencimento' : 
                         mov.tipo === 'perda' ? 'Perda' :
                         mov.tipo === 'baixa' ? 'Baixa' : 'Atualização'}
                      </div>
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-bold text-lg text-gray-900">{mov.epiNome}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold text-base text-gray-900">{mov.epiCA}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`flex items-center justify-center gap-1 px-3 py-1 rounded-full text-base font-semibold ${getStatusClass(mov.status)}`}>
                      {getStatusIcon(mov.status)}
                      {mov.status.charAt(0).toUpperCase() + mov.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold text-base text-gray-900">{mov.responsavel || 'Não informado'}</div>
                  </TableCell>
                </TableRow>
              ))}
              {movimentacoesColaborador.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4 text-gray-500">
                    Nenhuma movimentação encontrada para este colaborador
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default RelatorioColaborador; 