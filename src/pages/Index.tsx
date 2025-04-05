
import React from 'react';
import { 
  Users, 
  HardHat, 
  AlertTriangle, 
  Archive, 
  RefreshCw, 
  PercentCircle
} from 'lucide-react';
import { StatsCard } from '@/components/Dashboard/StatsCard';
import { AlertBanner } from '@/components/Dashboard/AlertBanner';
import { dashboardStats, alerts, ppeCatalog, employees, ppeMovements } from '@/data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable } from '@/components/UI/DataTable';

const Index = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo ao sistema de gerenciamento de EPIs ProtecSureFlow. Veja abaixo uma visão geral das principais métricas.
        </p>
      </div>

      {/* Alert Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Alertas Importantes</h2>
        <div>
          {alerts.map((alert) => (
            <AlertBanner key={alert.id} alert={alert} />
          ))}
        </div>
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
          <CardHeader>
            <CardTitle className="text-xl">Últimas Movimentações</CardTitle>
          </CardHeader>
          <CardContent>
            <DataTable
              data={ppeMovements.slice(0, 5)}
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
                    return <span>{typeLabels[item.type]}</span>;
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
