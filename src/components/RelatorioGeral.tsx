import React, { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useEPI } from '@/contexts/EPIContext';
import { AlertTriangle, CheckCircle, Clock, Package, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const RelatorioGeral = () => {
  const { epis, episAtribuidos, movimentacoes } = useEPI();

  // Calcular estatísticas gerais
  const estatisticas = useMemo(() => {
    const episAtivos = episAtribuidos.filter(epi => epi.status === 'ativo').length;
    const episVencidos = episAtribuidos.filter(epi => epi.status === 'vencido').length;
    const episProximosVencimento = episAtribuidos.filter(epi => epi.status === 'proximo_vencimento').length;
    const totalMovimentacoes = movimentacoes.length;
    const entregasUltimos30Dias = movimentacoes.filter(mov => {
      const dataMovimentacao = new Date(mov.data.split('/').reverse().join('-'));
      const hoje = new Date();
      const dias = Math.floor((hoje.getTime() - dataMovimentacao.getTime()) / (1000 * 60 * 60 * 24));
      return dias <= 30 && mov.tipo === 'atribuicao';
    }).length;

    const estoqueBaixo = epis.filter(epi => epi.quantidade <= 5).length;

    return {
      episAtivos,
      episVencidos,
      episProximosVencimento,
      totalMovimentacoes,
      entregasUltimos30Dias,
      estoqueBaixo
    };
  }, [epis, episAtribuidos, movimentacoes]);

  const exportarRelatorioGeralCSV = () => {
    // Preparar dados para o relatório
    const dados = {
      estatisticasGerais: [
        ['Estatísticas Gerais', ''],
        ['EPIs Ativos', estatisticas.episAtivos],
        ['EPIs Vencidos', estatisticas.episVencidos],
        ['EPIs Próximos ao Vencimento', estatisticas.episProximosVencimento],
        ['Total de Movimentações', estatisticas.totalMovimentacoes],
        ['Entregas nos Últimos 30 Dias', estatisticas.entregasUltimos30Dias],
        ['Itens com Estoque Baixo', estatisticas.estoqueBaixo],
      ],
      estoqueAtual: [
        ['', ''],
        ['Estoque Atual', ''],
        ['EPI', 'Quantidade', 'Status', 'Validade'],
        ...epis.map(epi => [epi.nome, epi.quantidade, epi.status, epi.validade])
      ]
    };

    // Converter para CSV
    const linhas = [
      ...dados.estatisticasGerais.map(linha => linha.join(';')),
      ...dados.estoqueAtual.map(linha => linha.join(';'))
    ].join('\n');

    // Criar e baixar arquivo
    const blob = new Blob([linhas], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_geral_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Relatório Geral do Sistema</h2>
        <Button onClick={exportarRelatorioGeralCSV} variant="outline" className="flex items-center gap-2">
          <Download size={16} />
          Exportar Relatório
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">EPIs Ativos</CardTitle>
            <CardDescription>Total de EPIs em uso</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-green-600">{estatisticas.episAtivos}</div>
              <CheckCircle size={24} className="text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">EPIs Vencidos</CardTitle>
            <CardDescription>Necessitam substituição</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-red-600">{estatisticas.episVencidos}</div>
              <AlertTriangle size={24} className="text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Próximos ao Vencimento</CardTitle>
            <CardDescription>Vencem em 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-amber-600">{estatisticas.episProximosVencimento}</div>
              <Clock size={24} className="text-amber-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Movimentações Totais</CardTitle>
            <CardDescription>Histórico completo</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-blue-600">{estatisticas.totalMovimentacoes}</div>
              <Package size={24} className="text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Entregas Recentes</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-purple-600">{estatisticas.entregasUltimos30Dias}</div>
              <Package size={24} className="text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Estoque Baixo</CardTitle>
            <CardDescription>Itens com qtd. ≤ 5</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-3xl font-bold text-orange-600">{estatisticas.estoqueBaixo}</div>
              <AlertTriangle size={24} className="text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Estoque Atual</CardTitle>
          <CardDescription>Visão geral do estoque de EPIs</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {epis.map(epi => (
              <div key={epi.id} className="p-4 border rounded-lg">
                <div className="font-medium">{epi.nome}</div>
                <div className="text-sm text-gray-500">Quantidade: {epi.quantidade}</div>
                <div className="text-sm text-gray-500">Validade: {epi.validade}</div>
                <div className={`mt-2 inline-flex items-center px-2 py-1 rounded-full text-xs ${
                  epi.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                  epi.status === 'Próximo ao vencimento' ? 'bg-amber-100 text-amber-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {epi.status}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RelatorioGeral; 