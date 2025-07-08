import React, { useState, useEffect } from 'react';
import { useCatalog } from '@/hooks/useCatalog';
import { useInventory } from '@/hooks/useInventory';
import { DataTable } from '@/components/UI/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, ArrowUpDown } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import { isStorageAvailable } from '@/utils/storage';
import { AddItemDialog } from '@/components/Inventory/AddItemDialog';
import { HistoryDialog } from '@/components/Inventory/HistoryDialog';
import { AssignDialog } from '@/components/Inventory/AssignDialog';

const Inventory = () => {
  const { toast } = useToast();
  const { catalogItems } = useCatalog();
  const { instances } = useInventory();
  const [localInstances, setLocalInstances] = useState(instances);
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState(false);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  useEffect(() => {
    setLocalInstances(instances);
  }, [instances]);

  useEffect(() => {
    if (!isStorageAvailable()) {
      toast({
        title: "Atenção",
        description: "O armazenamento local não está disponível. Suas alterações não serão salvas.",
        variant: "destructive"
      });
    }
  }, [toast]);

  const handleExport = () => {
    try {
      const dataStr = JSON.stringify(localInstances, null, 2);
      const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
      
      const exportFileDefaultName = 'inventory-report.json';

      const linkElement = document.createElement('a');
      linkElement.setAttribute('href', dataUri);
      linkElement.setAttribute('download', exportFileDefaultName);
      linkElement.click();
      
      toast({
        title: "Sucesso",
        description: "Relatório exportado com sucesso.",
      });
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível exportar o relatório.",
        variant: "destructive"
      });
    }
  };

  const getDaysUntilExpiry = (expiryDate: string) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Status change functionality can be removed since it's handled by the inventory system

  const inventoryData = localInstances.map(instance => {
    const catalogItem = catalogItems.find(item => item.id === instance.catalogItemId);
    return {
      ...instance,
      type: catalogItem?.type || 'Desconhecido',
      description: catalogItem?.description || 'Desconhecido',
      approvalNumber: catalogItem?.approvalNumber || 'N/A',
      supplier: catalogItem?.supplier || 'Desconhecido',
    };
  });

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
          <Button 
            className="bg-safety-blue hover:bg-safety-blue-dark"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" /> Adicionar ao Estoque
          </Button>
          <Button 
            variant="outline"
            onClick={handleExport}
          >
            <ArrowUpDown className="mr-2 h-4 w-4" /> Exportar Relatório
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {catalogItems.slice(0, 4).map((item) => (
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
                render: (item) => (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedItemId(item.id);
                        setIsHistoryDialogOpen(true);
                      }}
                    >
                      Histórico
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setSelectedItemId(item.id);
                        setIsAssignDialogOpen(true);
                      }}
                    >
                      Atribuir
                    </Button>
                  </div>
                )
              }
            ]}
            searchable={true}
            searchKeys={['id', 'type', 'status']}
          />
        </CardContent>
      </Card>

      <AddItemDialog 
        isOpen={isAddDialogOpen} 
        onClose={() => setIsAddDialogOpen(false)} 
      />
      
      <HistoryDialog 
        isOpen={isHistoryDialogOpen}
        onClose={() => setIsHistoryDialogOpen(false)}
        itemId={selectedItemId}
      />
      
      <AssignDialog 
        isOpen={isAssignDialogOpen}
        onClose={() => setIsAssignDialogOpen(false)}
        itemId={selectedItemId}
      />
    </div>
  );
};

export default Inventory;
