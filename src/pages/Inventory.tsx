import React, { useState, useEffect } from 'react';
import { ppeInstances, ppeCatalog, updatePPEInstances } from '@/data/mockData';
import { DataTable } from '@/components/UI/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { isStorageAvailable } from '@/utils/storage';

const Inventory = () => {
  const { toast } = useToast();
  const [localInstances, setLocalInstances] = useState(ppeInstances);
  
  useEffect(() => {
    // Verificar se o localStorage está disponível
    if (!isStorageAvailable()) {
      toast({
        title: "Atenção",
        description: "O armazenamento local não está disponível. Suas alterações não serão salvas.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const inventoryData = localInstances.map(instance => {
    const catalogItem = ppeCatalog.find(item => item.id === instance.catalogItemId);
    return {
      ...instance,
      type: catalogItem?.type || 'Desconhecido',
      description: catalogItem?.description || 'Desconhecido',
      approvalNumber: catalogItem?.approvalNumber || 'N/A',
      supplier: catalogItem?.supplier || 'Desconhecido',
    };
  });

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleStatusChange = (instanceId: string, newStatus: 'available' | 'in-use' | 'discarded') => {
    try {
      const updatedInstances = localInstances.map(instance => 
        instance.id === instanceId ? { ...instance, status: newStatus } : instance
      );
      
      // Atualiza estado local
      setLocalInstances(updatedInstances);
      
      // Atualiza no localStorage
      const success = updatePPEInstances(updatedInstances);
      
      // Exibe feedback ao usuário
      toast({
        title: success ? "Sucesso" : "Atenção",
        description: success 
          ? "Status do EPI atualizado com sucesso." 
          : "O status foi atualizado, mas não foi possível salvar permanentemente.",
        variant: success ? "default" : "destructive"
      });
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o status do EPI.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Estoque de EPIs</h1>
          <p className="text-muted-foreground mt-1">
            Controle de estoque e acompanhamento de validade dos equipamentos
          </p>
        </div>
        <div className="flex space-x-2">
          <Button className="bg-safety-blue hover:bg-safety-blue-dark">
            <Plus className="mr-2 h-4 w-4" /> Adicionar ao Estoque
          </Button>
          <Button variant="outline">
            <ArrowUpDown className="mr-2 h-4 w-4" /> Exportar Relatório
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {ppeCatalog.slice(0, 4).map((item) => (
          <Card key={item.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{item.type}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Em estoque:</span>
                  <span className="font-medium">{item.currentStock}</span>
                </div>
                <Progress 
                  value={(item.currentStock / (item.minimumStock * 2)) * 100} 
                  className="h-2"
                />
                <div className="text-xs text-muted-foreground mt-1">
                  Mínimo: {item.minimumStock}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Inventário Detalhado</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={inventoryData}
            columns={[
              { 
                key: 'id', 
                header: 'ID',
                render: (item) => (
                  <span className="font-mono text-xs">{item.id}</span>
                )
              },
              { 
                key: 'type', 
                header: 'Tipo de EPI',
              },
              { 
                key: 'approvalNumber', 
                header: 'Nº CA',
                render: (item) => (
                  <Badge variant="outline">{item.approvalNumber}</Badge>
                )
              },
              { 
                key: 'status', 
                header: 'Status',
                render: (item) => {
                  const statusColors = {
                    'available': 'bg-safety-green',
                    'in-use': 'bg-safety-blue',
                    'discarded': 'bg-safety-red'
                  };
                  const statusLabels = {
                    'available': 'Disponível',
                    'in-use': 'Em Uso',
                    'discarded': 'Descartado'
                  };
                  return (
                    <Badge className={statusColors[item.status]}>
                      {statusLabels[item.status]}
                    </Badge>
                  );
                }
              },
              { 
                key: 'expiryDate', 
                header: 'Validade',
                render: (item) => {
                  const daysLeft = getDaysUntilExpiry(item.expiryDate);
                  return (
                    <div>
                      <div className={
                        daysLeft < 30 ? 'text-safety-red' : 
                        daysLeft < 90 ? 'text-safety-orange' : 
                        'text-safety-green'
                      }>
                        {new Date(item.expiryDate).toLocaleDateString('pt-BR')}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {daysLeft > 0 
                          ? `${daysLeft} dias restantes` 
                          : 'Vencido'}
                      </div>
                    </div>
                  );
                }
              },
              { 
                key: 'actions', 
                header: 'Ações',
                render: () => (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Histórico</Button>
                    <Button variant="outline" size="sm">Atribuir</Button>
                  </div>
                )
              }
            ]}
            searchable={true}
            searchKeys={['id', 'type', 'status']}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Inventory;
