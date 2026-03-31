
import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { ppeMovements, ppeInstances, ppeCatalog, employees } from '@/data/mockData';
import { PPEMovement } from '@/types';

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
}

export const HistoryDialog: React.FC<HistoryDialogProps> = ({ isOpen, onClose, itemId }) => {
  const [itemMovements, setItemMovements] = useState<PPEMovement[]>([]);
  const [itemDetails, setItemDetails] = useState<{type: string, approvalNumber: string} | null>(null);
  
  useEffect(() => {
    // Find item details
    const instance = ppeInstances.find(item => item.id === itemId);
    if (instance) {
      const catalogItem = ppeCatalog.find(item => item.id === instance.catalogItemId);
      if (catalogItem) {
        setItemDetails({
          type: catalogItem.type,
          approvalNumber: catalogItem.approvalNumber
        });
      }
    }
    
    // Find all movements related to this item
    const movements = ppeMovements.filter(movement => movement.ppeInstanceId === itemId);
    setItemMovements(movements);
  }, [itemId]);

  // Type labels for movement types
  const typeLabels = {
    'delivery': 'Entrega',
    'return': 'Devolução',
    'replacement': 'Substituição',
    'discard': 'Descarte'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Histórico do Item</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <div className="flex flex-col md:flex-row md:justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">
                ID do Item: <span className="font-mono">{itemId}</span>
              </p>
              {itemDetails && (
                <>
                  <p className="text-sm mt-1">
                    <span className="font-semibold">Tipo:</span> {itemDetails.type}
                  </p>
                  <p className="text-sm mt-1">
                    <span className="font-semibold">CA:</span> {itemDetails.approvalNumber}
                  </p>
                </>
              )}
            </div>
            <div>
              <Badge variant="outline" className="bg-gray-100">
                {itemMovements.length} movimentações
              </Badge>
            </div>
          </div>
          
          {itemMovements.length > 0 ? (
            <div className="border rounded-md overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Colaborador</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Autorizado por</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {itemMovements.map(movement => {
                    const employee = employees.find(emp => emp.id === movement.employeeId);
                    return (
                      <TableRow key={movement.id}>
                        <TableCell>
                          {new Date(movement.date).toLocaleDateString('pt-BR')}
                        </TableCell>
                        <TableCell>
                          <Badge className={
                            movement.type === 'delivery' ? 'bg-safety-green' :
                            movement.type === 'return' ? 'bg-safety-blue' :
                            movement.type === 'replacement' ? 'bg-safety-orange' :
                            'bg-safety-red'
                          }>
                            {typeLabels[movement.type]}
                          </Badge>
                        </TableCell>
                        <TableCell>{employee?.name || 'Desconhecido'}</TableCell>
                        <TableCell>{movement.reason}</TableCell>
                        <TableCell>{movement.authorizedBy}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              Nenhuma movimentação registrada para este item.
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
