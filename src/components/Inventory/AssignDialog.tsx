
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useEmployees } from '@/hooks/useEmployees';
import { useCatalog } from '@/hooks/useCatalog';
import { useInventory } from '@/hooks/useInventory';

interface AssignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
}

export const AssignDialog: React.FC<AssignDialogProps> = ({ isOpen, onClose, itemId }) => {
  const { toast } = useToast();
  const { employees } = useEmployees();
  const { catalogItems } = useCatalog();
  const { instances, assignPPEToEmployee } = useInventory();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [itemDetails, setItemDetails] = useState<{type: string} | null>(null);
  
  useEffect(() => {
    // Find item details when dialog opens or itemId changes
    const instance = instances.find(item => item.id === itemId);
    if (instance) {
      const catalogItem = catalogItems.find(item => item.id === instance.catalogItemId);
      if (catalogItem) {
        setItemDetails({
          type: catalogItem.type
        });
      }
    }
  }, [itemId, isOpen, instances, catalogItems]);

  const handleAssign = async () => {
    if (!selectedEmployee) {
      toast({
        title: "Erro",
        description: "Selecione um colaborador para atribuir o EPI.",
        variant: "destructive"
      });
      return;
    }

    const employee = employees.find(emp => emp.id === selectedEmployee);
    if (!employee) {
      toast({
        title: "Erro",
        description: "Colaborador não encontrado.",
        variant: "destructive"
      });
      return;
    }

    const instance = instances.find(inst => inst.id === itemId);
    if (!instance) {
      toast({
        title: "Erro",
        description: "Item não encontrado.",
        variant: "destructive"
      });
      return;
    }

    const success = await assignPPEToEmployee(
      instance.catalogItemId,
      selectedEmployee,
      employee,
      reason || 'Entrega padrão'
    );

    if (success) {
      toast({
        title: "Sucesso",
        description: `EPI atribuído com sucesso ao colaborador.`
      });
      setSelectedEmployee('');
      setReason('');
      onClose();
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atribuir o EPI ao colaborador.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atribuir EPI</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-sm text-muted-foreground">
            ID do Item: <span className="font-mono">{itemId}</span>
          </p>
          {itemDetails && (
            <p className="text-sm">
              <span className="font-semibold">Tipo:</span> {itemDetails.type}
            </p>
          )}
          
          <div className="space-y-2 pt-2">
            <Label htmlFor="employee">Colaborador</Label>
            <Select value={selectedEmployee} onValueChange={setSelectedEmployee}>
              <SelectTrigger id="employee">
                <SelectValue placeholder="Selecione um colaborador" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((employee) => (
                  <SelectItem key={employee.id} value={employee.id}>
                    {employee.name} - {employee.department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da Entrega</Label>
            <Textarea 
              id="reason" 
              placeholder="Informe o motivo da entrega..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleAssign}>Atribuir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
