import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, Cell, PieChart, Pie } from 'recharts';
import Header from './Header';
import Navigation from './Navigation';
import { useEPI } from '@/contexts/EPIContext';
import { useInspecao } from '@/contexts/InspecaoContext';
import { Loader2, TrendingUp, AlertTriangle, CheckCircle2, RotateCcw, XCircle, Calendar } from 'lucide-react';

const CORES_STATUS = {
  'Ativo': '#10b981',
  'Próximo ao vencimento': '#eab308',
  'Vencido': '#ef4444',
  'Devolvido': '#6366f1',
  'Baixado': '#8b5cf6'
};

const MARINAS = [
  'Holding',
  'Marina Verolme',
  'Marina Piratas',
  'Marina Itacuruca',
  'Marina Porto Bracuhy',
  'Marina Ribeira',
  'Marina Refugio de Paraty',
  'BR Marinas Gloria',
  'BRM Buzios Marina',
  'BR Marinas JL Bracuhy',
  'BR Marinas Boa Vista'
];

const Dashboard = () => {
  const { epis, episAtribuidos, movimentacoes } = useEPI();
  const { inspecoes } = useInspecao();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [colaboradores, setColaboradores] = useState<any[]>([]);
  const [timeFrame, setTimeFrame] = useState<'1month' | '3months' | '12months'>('3months');

  useEffect(() => {
    const loadData = () => {
      try {
        console.log('Iniciando carregamento dos dados do dashboard...');
        const savedColaboradores = localStorage.getItem('colaboradores');
        console.log('Dados de colaboradores encontrados:', savedColaboradores ? 'sim' : 'não');
        setColaboradores(savedColaboradores ? JSON.parse(savedColaboradores) : []);
        console.log('Dados carregados com sucesso');
        setLoading(false);
      } catch (error) {
        console.error('Erro detalhado ao carregar dados:', error);
        setError('Erro ao carregar dados do dashboard. Por favor, recarregue a página.');
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtrar movimentações por período
  const movimentacoesFiltradas = useMemo(() => {
    const now = new Date();
    const startDate = new Date();
    
    switch (timeFrame) {
      case '1month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case '3months':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '12months':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return movimentacoes.filter(mov => {
      const movDate = new Date(mov.data.split('/').reverse().join('-'));
      return movDate >= startDate;
    });
  }, [movimentacoes, timeFrame]);

  // Dados para gráfico de movimentações mensais
  const monthlyMovementData = useMemo(() => {
    const months = timeFrame === '1month' ? 1 : timeFrame === '3months' ? 3 : 12;
    const data = [];
    const now = new Date();

    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthName = date.toLocaleDateString('pt-BR', { month: 'short' });
      
      const monthMovements = movimentacoesFiltradas.filter(mov => {
        const movDate = new Date(mov.data.split('/').reverse().join('-'));
        return movDate.getMonth() === date.getMonth() && 
               movDate.getFullYear() === date.getFullYear();
      });

      data.push({
        month: monthName,
        atribuicao: monthMovements.filter(m => m.tipo === 'atribuicao').length,
        devolucao: monthMovements.filter(m => m.tipo === 'devolucao').length,
        perda: monthMovements.filter(m => m.tipo === 'perda').length,
        vencimento: monthMovements.filter(m => m.tipo === 'vencimento').length
      });
    }

    return data;
  }, [movimentacoesFiltradas, timeFrame]);

  // Dados para gráfico de pizza de inspeções
  const inspecaoPieData = useMemo(() => {
    const aprovadas = inspecoes.filter(i => i.status === 'aprovado').length;
    const alertas = inspecoes.filter(i => i.status === 'alerta').length;
    const reprovadas = inspecoes.filter(i => i.status === 'reprovado').length;

    return [
      { name: 'Aprovadas', value: aprovadas, color: '#10b981' },
      { name: 'Alertas', value: alertas, color: '#eab308' },
      { name: 'Reprovadas', value: reprovadas, color: '#ef4444' }
    ].filter(item => item.value > 0);
  }, [inspecoes]);

  if (loading) {
    console.log('Dashboard em estado de carregamento');
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    );
  }

  if (error) {
    console.error('Dashboard apresentou erro:', error);
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  // Calcular as quantidades para cada status
  const statusCount = epis.reduce((acc, epi) => {
    const status = epi.status || 'Ativo';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Dados para o gráfico de barras de status
  const barChartData = [
    { name: 'Ativos', value: statusCount['Ativo'] || 0 },
    { name: 'Próx. Vencimento', value: statusCount['Próximo ao vencimento'] || 0 },
    { name: 'Vencidos', value: statusCount['Vencido'] || 0 },
    { name: 'Devolvidos', value: episAtribuidos.filter(epi => epi.status === 'devolvido').length },
    { name: 'Baixados', value: episAtribuidos.filter(epi => epi.status === 'baixado').length }
  ].filter(item => item.value > 0);

  // Estatísticas de inspeções
  const inspecaoStats = useMemo(() => {
    const total = inspecoes.length;
    const aprovadas = inspecoes.filter(i => i.status === 'aprovado').length;
    const alertas = inspecoes.filter(i => i.status === 'alerta').length;
    const reprovadas = inspecoes.filter(i => i.status === 'reprovado').length;
    const taxaConformidade = total > 0 ? Math.round((aprovadas / total) * 100) : 0;
    
    return { total, aprovadas, alertas, reprovadas, taxaConformidade };
  }, [inspecoes]);

  // Calcular quantidade de EPIs por marina
  const episPorMarina = MARINAS.map(marina => {
    const colaboradoresDaMarina = colaboradores.filter((col: any) => col.marina === marina);
    const episDaMarina = colaboradoresDaMarina.reduce((total: number, col: any) => {
      const episDoColaborador = episAtribuidos.filter(epi => 
        epi.colaboradorId === col.id && 
        epi.status !== 'devolvido' && 
        epi.status !== 'baixado'
      ).length;
      return total + episDoColaborador;
    }, 0);

    return {
      name: marina,
      quantidade: episDaMarina
    };
  }).sort((a, b) => b.quantidade - a.quantidade);

  // Estatísticas gerais
  const totalEPIs = epis.length;
  const episAtivos = statusCount['Ativo'] || 0;
  const episVencidos = statusCount['Vencido'] || 0;
  const episProximosVencimento = statusCount['Próximo ao vencimento'] || 0;
  const episDevolvidos = episAtribuidos.filter(epi => epi.status === 'devolvido').length;
  const episBaixados = episAtribuidos.filter(epi => epi.status === 'baixado').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      <Navigation />
      
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500">Visão geral dos EPIs</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card de Movimentações com Filtro de Período */}
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl font-semibold text-gray-900">Movimentações por Período</CardTitle>
                  <CardDescription>Análise de movimentações de EPIs</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={timeFrame === '1month' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeFrame('1month')}
                  >
                    1 Mês
                  </Button>
                  <Button
                    variant={timeFrame === '3months' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeFrame('3months')}
                  >
                    3 Meses
                  </Button>
                  <Button
                    variant={timeFrame === '12months' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setTimeFrame('12months')}
                  >
                    1 Ano
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyMovementData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        borderRadius: '8px',
                        border: 'none',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                    />
                    <Legend />
                    <Bar dataKey="atribuicao" name="Atribuições" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="devolucao" name="Devoluções" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="perda" name="Perdas" fill="#ef4444" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="vencimento" name="Vencimentos" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Card de Inspeções */}
          <Card className="bg-white shadow-xl">
            <CardHeader>
              <CardTitle className="text-xl font-semibold text-gray-900">Status das Inspeções</CardTitle>
              <CardDescription>Taxa de conformidade: {inspecaoStats.taxaConformidade}%</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[300px]">
                {inspecaoPieData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={inspecaoPieData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {inspecaoPieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-500">
                    Nenhuma inspeção registrada
                  </div>
                )}
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{inspecaoStats.aprovadas}</div>
                  <div className="text-sm text-gray-500">Aprovadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{inspecaoStats.alertas}</div>
                  <div className="text-sm text-gray-500">Alertas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{inspecaoStats.reprovadas}</div>
                  <div className="text-sm text-gray-500">Reprovadas</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Gráfico de Status dos EPIs */}
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">Quantidade por Status</CardTitle>
            <CardDescription>Número total de EPIs em cada status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gradientAtivo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="gradientProximo" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#eab308" />
                      <stop offset="100%" stopColor="#d97706" />
                    </linearGradient>
                    <linearGradient id="gradientVencido" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#dc2626" />
                    </linearGradient>
                    <linearGradient id="gradientDevolvido" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                    <linearGradient id="gradientBaixado" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="name" stroke="#6b7280" />
                  <YAxis stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend verticalAlign="top" height={36} />
                  <Bar 
                    dataKey="value" 
                    name="Quantidade"
                    radius={[8, 8, 0, 0]}
                  >
                    {barChartData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={CORES_STATUS[entry.name as keyof typeof CORES_STATUS] || '#cbd5e1'} 
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Gráfico de EPIs por Marina */}
        <Card className="bg-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-900">EPIs por Marina</CardTitle>
            <CardDescription>Distribuição de EPIs ativos por unidade</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={episPorMarina} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="gradientMarina" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#2563eb" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis type="number" stroke="#6b7280" />
                  <YAxis dataKey="name" type="category" width={150} stroke="#6b7280" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'rgba(255, 255, 255, 0.95)',
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                    cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="quantidade" 
                    name="EPIs Ativos"
                    radius={[0, 8, 8, 0]}
                    fill="url(#gradientMarina)"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;