
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { employees, ppeInstances, ppeCatalog, ppeMovements, updatePPEInstances, updatePPEMovements, updateEmployees } from '@/data/mockData';
import { PPEInstance, PPEMovement } from '@/types';

interface AssignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
}

export const AssignDialog: React.FC<AssignDialogProps> = ({ isOpen, onClose, itemId }) => {
  const { toast } = useToast();
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [reason, setReason] = useState<string>('');
  const [itemDetails, setItemDetails] = useState<{type: string} | null>(null);
  
  useEffect(() => {
    // Find item details when dialog opens or itemId changes
    const instance = ppeInstances.find(item => item.id === itemId);
    if (instance) {
      const catalogItem = ppeCatalog.find(item => item.id === instance.catalogItemId);
      if (catalogItem) {
        setItemDetails({
          type: catalogItem.type
        });
      }
    }
  }, [itemId, isOpen]);

  const handleAssign = () => {
    if (!selectedEmployee) {
      toast({
        title: "Erro",
        description: "Selecione um colaborador para atribuir o EPI.",
        variant: "destructive"
      });
      return;
    }

    try {
      // 1. Update the PPE instance status
      const updatedInstances = ppeInstances.map(instance => 
        instance.id === itemId
          ? { ...instance, status: 'in-use' as const }
          : instance
      );
      
      // 2. Create a movement record
      const newMovement: PPEMovement = {
        id: `mov-${Date.now()}`,
        type: 'delivery',
        date: new Date().toISOString(),
        employeeId: selectedEmployee,
        ppeInstanceId: itemId,
        reason: reason || 'Entrega padrão',
        authorizedBy: 'Admin do Sistema', // This could be dynamically set based on logged user
        digitalSignature: `sig-${Date.now()}`
      };
      
      // 3. Update the employee's assigned PPE list
      const updatedEmployees = employees.map(emp => 
        emp.id === selectedEmployee
          ? { ...emp, assignedPPE: [...emp.assignedPPE, itemId] }
          : emp
      );
      
      // 4. Save all the updates
      const instancesSuccess = updatePPEInstances(updatedInstances);
      const movementSuccess = updatePPEMovements([...ppeMovements, newMovement]);
      const employeesSuccess = updateEmployees(updatedEmployees);
      
      if (instancesSuccess && movementSuccess && employeesSuccess) {
        toast({
          title: "Sucesso",
          description: `EPI atribuído com sucesso ao colaborador.`
        });
        onClose();
      } else {
        throw new Error("Falha ao salvar uma ou mais atualizações");
      }
    } catch (error) {
      console.error("Erro ao atribuir EPI:", error);
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
