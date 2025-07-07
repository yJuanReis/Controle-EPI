
import React, { useState, useMemo } from 'react';
import { 
  Users, 
  HardHat, 
  AlertTriangle, 
  Archive, 
  RefreshCw, 
  PercentCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { dashboardStats, ppeCatalog, employees, ppeMovements } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/UI/DataTable';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { ChartContainer, ChartTooltipContent, ChartTooltip } from '@/components/ui/chart';
import { format, subMonths, getMonth, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';


const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
const MOVEMENT_COLORS = {
  delivery: '#3498db',    // azul
  return: '#2ecc71',      // verde
  replacement: '#f39c12', // amarelo
  discard: '#e74c3c'      // vermelho
};

const MOVEMENT_LABELS = {
  delivery: 'Entrega',
  return: 'Devolução',
  replacement: 'Substituição',
  discard: 'Descarte'
};

const Index = () => {
  const [timeFrame, setTimeFrame] = useState('3months');
  const [selectedMovementType, setSelectedMovementType] = useState<string | null>(null);

  // Get movement data for the selected time frame
  const movementData = useMemo(() => {
    let startDate;
    const now = new Date();
    
    switch(timeFrame) {
      case '1month':
        startDate = subMonths(now, 1);
        break;
      case '3months':
        startDate = subMonths(now, 3);
        break;
      case '6months':
        startDate = subMonths(now, 6);
        break;
      default:
        startDate = subMonths(now, 3);
    }
    
    return ppeMovements.filter(movement => {
      const movementDate = parseISO(movement.date);
      return movementDate >= startDate;
    });
  }, [timeFrame]);

  // Prepare data for monthly movement chart
  const monthlyMovementData = useMemo(() => {
    const data: {
      month: string;
      delivery: number;
      return: number;
      replacement: number;
      discard: number;
    }[] = [];
    
    const now = new Date();
    let startMonth;
    
    switch(timeFrame) {
      case '1month':
        startMonth = getMonth(subMonths(now, 1));
        break;
      case '3months':
        startMonth = getMonth(subMonths(now, 3));
        break;
      case '6months':
        startMonth = getMonth(subMonths(now, 6));
        break;
      default:
        startMonth = getMonth(subMonths(now, 3));
    }
    
    // Initialize data array with months
    for (let i = 0; i <= getMonth(now) - startMonth; i++) {
      const monthDate = subMonths(now, i);
      data.unshift({
        month: format(monthDate, 'MMM', { locale: ptBR }),
        delivery: 0,
        return: 0,
        replacement: 0,
        discard: 0
      });
    }

    // Populate with actual data
    movementData.forEach(movement => {
      const date = parseISO(movement.date);
      const monthName = format(date, 'MMM', { locale: ptBR });
      const monthData = data.find(d => d.month === monthName);
      
      if (monthData) {
        monthData[movement.type as keyof typeof MOVEMENT_LABELS] += 1;
      }
    });
    
    return data;
  }, [movementData, timeFrame]);

  // Pie chart data for movement types
  const pieChartData = useMemo(() => {
    const typeCount: Record<string, number> = { 
      delivery: 0, 
      return: 0, 
      replacement: 0, 
      discard: 0 
    };
    
    movementData.forEach((movement) => {
      typeCount[movement.type] = (typeCount[movement.type] || 0) + 1;
    });
    
    return Object.entries(typeCount).map(([key, value]) => ({
      name: MOVEMENT_LABELS[key as keyof typeof MOVEMENT_LABELS],
      value,
      type: key
    }));
  }, [movementData]);

  // Filter movements by type if one is selected
  const filteredMovements = useMemo(() => {
    if (!selectedMovementType) return movementData.slice(0, 5);
    return movementData
      .filter(movement => movement.type === selectedMovementType)
      .slice(0, 5);
  }, [movementData, selectedMovementType]);

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao sistema de gerenciamento de EPIs ProtecSureFlow. Veja abaixo uma visão geral das principais métricas.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <StatsCard
          title="Total de Colaboradores"
          value={dashboardStats.totalEmployees}
          icon={<Users className="h-5 w-5 text-safety-blue" />}
          className="bg-safety-blue/5 border-safety-blue/20"
          valueClassName="text-safety-blue"
        />
        <StatsCard
          title="Total de EPIs"
          value={dashboardStats.totalPPEItems}
          icon={<HardHat className="h-5 w-5 text-safety-orange" />}
          className="bg-safety-orange/5 border-safety-orange/20"
          valueClassName="text-safety-orange"
        />
        <StatsCard
          title="EPIs Próximos ao Vencimento"
          value={dashboardStats.expiringPPECount}
          icon={<AlertTriangle className="h-5 w-5 text-safety-red" />}
          className="bg-safety-red/5 border-safety-red/20"
          valueClassName="text-safety-red"
        />
        <StatsCard
          title="Itens com Estoque Baixo"
          value={dashboardStats.lowStockCount}
          icon={<Archive className="h-5 w-5 text-safety-orange-dark" />}
          className="bg-safety-orange/5 border-safety-orange/20"
          valueClassName="text-safety-orange-dark"
        />
        <StatsCard
          title="Movimentações Hoje"
          value={dashboardStats.movementsToday}
          icon={<RefreshCw className="h-5 w-5 text-safety-green" />}
          className="bg-safety-green/5 border-safety-green/20"
          valueClassName="text-safety-green"
        />
        <StatsCard
          title="Taxa de Conformidade"
          value={`${dashboardStats.complianceRate}%`}
          icon={<PercentCircle className="h-5 w-5 text-safety-blue" />}
          className="bg-safety-blue/5 border-safety-blue/20"
          valueClassName="text-safety-blue"
        />
      </div>

      {/* Movement Analysis Charts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Análise de Movimentações</h2>
          <div className="flex items-center gap-2">
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
              variant={timeFrame === '6months' ? 'default' : 'outline'} 
              size="sm"
              onClick={() => setTimeFrame('6months')}
            >
              6 Meses
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-xl">Movimentações por Mês</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyMovementData}
                    margin={{ top: 20, right: 30, left: 0, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip 
                      formatter={(value, name) => {
                        const translatedName = 
                          name === 'delivery' ? 'Entrega' :
                          name === 'return' ? 'Devolução' :
                          name === 'replacement' ? 'Substituição' : 'Descarte';
                        return [value, translatedName];
                      }}
                    />
                    <Legend 
                      formatter={(value) => {
                        return value === 'delivery' ? 'Entrega' :
                          value === 'return' ? 'Devolução' :
                          value === 'replacement' ? 'Substituição' : 'Descarte';
                      }}
                    />
                    <Bar dataKey="delivery" name="delivery" fill={MOVEMENT_COLORS.delivery} />
                    <Bar dataKey="return" name="return" fill={MOVEMENT_COLORS.return} />
                    <Bar dataKey="replacement" name="replacement" fill={MOVEMENT_COLORS.replacement} />
                    <Bar dataKey="discard" name="discard" fill={MOVEMENT_COLORS.discard} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Tipos de Movimentação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex flex-col items-center justify-center">
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      nameKey="name"
                      onClick={(data) => {
                        setSelectedMovementType(
                          selectedMovementType === data.type ? null : data.type
                        );
                      }}
                    >
                      {pieChartData.map((entry, index) => (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={MOVEMENT_COLORS[entry.type as keyof typeof MOVEMENT_COLORS]} 
                          stroke={selectedMovementType === entry.type ? '#000' : undefined}
                          strokeWidth={selectedMovementType === entry.type ? 2 : undefined}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      formatter={(value, name, props) => {
                        return [`${value} movimentações`, props.payload.name];
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex flex-wrap gap-2 mt-2 justify-center">
                  {pieChartData.map((entry) => (
                    <Badge 
                      key={entry.type}
                      variant={selectedMovementType === entry.type ? "default" : "outline"}
                      className="cursor-pointer flex items-center gap-1.5"
                      style={{
                        borderColor: MOVEMENT_COLORS[entry.type as keyof typeof MOVEMENT_COLORS],
                        color: selectedMovementType === entry.type ? 'white' : MOVEMENT_COLORS[entry.type as keyof typeof MOVEMENT_COLORS],
                        backgroundColor: selectedMovementType === entry.type 
                          ? MOVEMENT_COLORS[entry.type as keyof typeof MOVEMENT_COLORS] 
                          : 'transparent'
                      }}
                      onClick={() => {
                        setSelectedMovementType(
                          selectedMovementType === entry.type ? null : entry.type
                        );
                      }}
                    >
                      <span className="inline-block w-2 h-2 rounded-full" 
                        style={{ backgroundColor: MOVEMENT_COLORS[entry.type as keyof typeof MOVEMENT_COLORS] }}
                      />
                      {entry.name} ({entry.value})
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Data Tables */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">EPIs com Baixo Estoque</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={ppeCatalog.filter(item => item.currentStock < item.minimumStock)}
              columns={[
                { key: 'type', header: 'Tipo' },
                { key: 'currentStock', header: 'Estoque Atual' },
                { key: 'minimumStock', header: 'Estoque Mínimo' },
                { 
                  key: 'status', 
                  header: 'Status', 
                  render: (item) => (
                    <div className="flex items-center">
                      <span className="inline-block w-2 h-2 rounded-full bg-safety-red mr-2"></span>
                      <span className="text-safety-red-dark">Crítico</span>
                    </div>
                  )
                },
              ]}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl">
              {selectedMovementType 
                ? `${MOVEMENT_LABELS[selectedMovementType as keyof typeof MOVEMENT_LABELS]} Recentes` 
                : 'Últimas Movimentações'}
            </CardTitle>
            {selectedMovementType && (
              <Button variant="ghost" size="sm" onClick={() => setSelectedMovementType(null)}>
                Limpar filtro
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <DataTable
              data={filteredMovements}
              columns={[
                { 
                  key: 'type', 
                  header: 'Tipo',
                  render: (item) => {
                    const typeLabels = {
                      'delivery': 'Entrega',
                      'return': 'Devolução',
                      'replacement': 'Substituição',
                      'discard': 'Descarte'
                    };
                    const color = MOVEMENT_COLORS[item.type as keyof typeof MOVEMENT_COLORS];
                    
                    return (
                      <div className="flex items-center">
                        <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: color }}></span>
                        <span>{typeLabels[item.type as keyof typeof typeLabels]}</span>
                      </div>
                    );
                  }
                },
                { 
                  key: 'date', 
                  header: 'Data',
                  render: (item) => {
                    return new Date(item.date).toLocaleDateString('pt-BR');
                  }
                },
                { 
                  key: 'employeeId', 
                  header: 'Colaborador',
                  render: (item) => {
                    const employee = employees.find(emp => emp.id === item.employeeId);
                    return employee ? employee.name : item.employeeId;
                  }
                },
              ]}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
