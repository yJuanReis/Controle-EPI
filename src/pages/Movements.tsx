
import React from 'react';
import { ppeMovements, employees, ppeInstances, ppeCatalog } from '@/data/mockData';
import { DataTable } from '@/components/UI/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, FileDown, FileUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const Movements = () => {
  // Combine movement data with employee and PPE data
  const movementsData = ppeMovements.map(movement => {
    const employee = employees.find(emp => emp.id === movement.employeeId);
    const ppeInstance = ppeInstances.find(ppe => ppe.id === movement.ppeInstanceId);
    const catalogItem = ppeInstance 
      ? ppeCatalog.find(item => item.id === ppeInstance.catalogItemId)
      : null;
    
    return {
      ...movement,
      employeeName: employee?.name || 'Unknown',
      ppeType: catalogItem?.type || 'Unknown',
    };
  });

  const typeIcons = {
    'delivery': <FileDown className="h-4 w-4 text-safety-green" />,
    'return': <FileUp className="h-4 w-4 text-safety-blue" />,
    'replacement': <Badge variant="outline" className="bg-safety-orange/10 text-safety-orange border-safety-orange/20">Substituição</Badge>,
    'discard': <Badge variant="outline" className="bg-safety-red/10 text-safety-red border-safety-red/20">Descarte</Badge>,
  };

  const typeLabels = {
    'delivery': 'Entrega',
    'return': 'Devolução',
    'replacement': 'Substituição',
    'discard': 'Descarte'
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Movimentações</h1>
          <p className="text-muted-foreground mt-1">
            Registro de entregas, devoluções e substituições de EPIs
          </p>
        </div>
        <div className="flex space-x-2">
          <Button className="bg-safety-blue hover:bg-safety-blue-dark">
            <Plus className="mr-2 h-4 w-4" /> Nova Movimentação
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="mb-4">
          <TabsTrigger value="all">Todas</TabsTrigger>
          <TabsTrigger value="delivery">Entregas</TabsTrigger>
          <TabsTrigger value="return">Devoluções</TabsTrigger>
          <TabsTrigger value="replacement">Substituições</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Todas as Movimentações</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={movementsData}
                columns={[
                  { 
                    key: 'type', 
                    header: 'Tipo',
                    render: (item) => (
                      <div className="flex items-center gap-2">
                        {typeIcons[item.type]}
                        <span>{typeLabels[item.type]}</span>
                      </div>
                    )
                  },
                  { 
                    key: 'date', 
                    header: 'Data',
                    render: (item) => (
                      <div>
                        <div>
                          {new Date(item.date).toLocaleDateString('pt-BR')}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {new Date(item.date).toLocaleTimeString('pt-BR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </div>
                      </div>
                    )
                  },
                  { 
                    key: 'employeeName', 
                    header: 'Colaborador',
                  },
                  { 
                    key: 'ppeType', 
                    header: 'Equipamento',
                  },
                  { 
                    key: 'reason', 
                    header: 'Motivo',
                  },
                  { 
                    key: 'authorizedBy', 
                    header: 'Autorizado por',
                  },
                  { 
                    key: 'actions', 
                    header: 'Ações',
                    render: () => (
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">Detalhes</Button>
                        <Button variant="outline" size="sm">Comprovante</Button>
                      </div>
                    )
                  }
                ]}
                searchable={true}
                searchKeys={['employeeName', 'ppeType', 'reason', 'authorizedBy']}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="delivery">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Entregas de EPIs</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={movementsData.filter(m => m.type === 'delivery')}
                columns={[
                  { 
                    key: 'date', 
                    header: 'Data',
                    render: (item) => (
                      new Date(item.date).toLocaleDateString('pt-BR')
                    )
                  },
                  { 
                    key: 'employeeName', 
                    header: 'Colaborador',
                  },
                  { 
                    key: 'ppeType', 
                    header: 'Equipamento',
                  },
                  { 
                    key: 'reason', 
                    header: 'Motivo',
                  },
                  { 
                    key: 'authorizedBy', 
                    header: 'Autorizado por',
                  },
                  { 
                    key: 'actions', 
                    header: 'Ações',
                    render: () => (
                      <Button variant="outline" size="sm">Comprovante</Button>
                    )
                  }
                ]}
                searchable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="return">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Devoluções de EPIs</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={movementsData.filter(m => m.type === 'return')}
                columns={[
                  { 
                    key: 'date', 
                    header: 'Data',
                    render: (item) => (
                      new Date(item.date).toLocaleDateString('pt-BR')
                    )
                  },
                  { 
                    key: 'employeeName', 
                    header: 'Colaborador',
                  },
                  { 
                    key: 'ppeType', 
                    header: 'Equipamento',
                  },
                  { 
                    key: 'reason', 
                    header: 'Motivo',
                  },
                  { 
                    key: 'actions', 
                    header: 'Ações',
                    render: () => (
                      <Button variant="outline" size="sm">Detalhes</Button>
                    )
                  }
                ]}
                searchable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="replacement">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Substituições de EPIs</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                data={movementsData.filter(m => m.type === 'replacement')}
                columns={[
                  { 
                    key: 'date', 
                    header: 'Data',
                    render: (item) => (
                      new Date(item.date).toLocaleDateString('pt-BR')
                    )
                  },
                  { 
                    key: 'employeeName', 
                    header: 'Colaborador',
                  },
                  { 
                    key: 'ppeType', 
                    header: 'Equipamento',
                  },
                  { 
                    key: 'reason', 
                    header: 'Motivo',
                  },
                  { 
                    key: 'actions', 
                    header: 'Ações',
                    render: () => (
                      <Button variant="outline" size="sm">Detalhes</Button>
                    )
                  }
                ]}
                searchable={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Movements;
