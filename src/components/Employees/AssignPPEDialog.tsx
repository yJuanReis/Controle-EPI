import React, { useState } from 'react';
import { Employee } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCatalog } from '@/hooks/useCatalog';
import { useInventory } from '@/hooks/useInventory';
import { Badge } from '@/components/ui/badge';

interface AssignPPEDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export const AssignPPEDialog = ({ open, onOpenChange, employee }: AssignPPEDialogProps) => {
  const { toast } = useToast();
  const { catalogItems } = useCatalog();
  const { assignPPEToEmployee, getAvailableInstances } = useInventory();
  
  const [selectedPPEId, setSelectedPPEId] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  if (!employee) return null;

  // Get PPE types that the employee needs but doesn't have assigned
  const missingPPE = employee.requiredPPE.filter(requiredId => {
    // Check if employee already has this type of PPE assigned
    return !employee.assignedPPE.some(assignedId => {
      const instances = getAvailableInstances(requiredId);
      return instances.some(instance => employee.assignedPPE.includes(instance.id));
    });
  });

  const availablePPEOptions = catalogItems.filter(item => {
    const availableInstances = getAvailableInstances(item.id);
    return availableInstances.length > 0 && item.currentStock > 0;
  });

  const handleAssign = async () => {
    if (!selectedPPEId) {
      toast({
        title: "Erro",
        description: "Selecione um EPI para atribuir.",
        variant: "destructive",
      });
      return;
    }

    const success = await assignPPEToEmployee(
      selectedPPEId,
      employee.id,
      employee,
      reason || 'Entrega padrão'
    );

    if (success) {
      toast({
        title: "Sucesso",
        description: `EPI atribuído com sucesso a ${employee.name}.`,
      });
      setSelectedPPEId('');
      setReason('');
      onOpenChange(false);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atribuir o EPI ao colaborador.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Atribuir EPI</DialogTitle>
          <DialogDescription>
            Atribuir equipamento de proteção para {employee.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {missingPPE.length > 0 && (
            <div className="p-3 bg-safety-orange/10 border border-safety-orange/20 rounded-md">
              <p className="text-sm font-medium text-safety-orange-dark mb-2">
                EPIs obrigatórios pendentes:
              </p>
              <div className="flex flex-wrap gap-1">
                {missingPPE.map(ppeId => {
                  const item = catalogItems.find(cat => cat.id === ppeId);
                  return (
                    <Badge key={ppeId} variant="outline" className="bg-safety-orange/10">
                      {item?.type || ppeId}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="ppe-select">Selecionar EPI</Label>
            <Select value={selectedPPEId} onValueChange={setSelectedPPEId}>
              <SelectTrigger id="ppe-select">
                <SelectValue placeholder="Escolha um EPI disponível" />
              </SelectTrigger>
              <SelectContent>
                {availablePPEOptions.map((item) => {
                  const availableCount = getAvailableInstances(item.id).length;
                  const isRequired = employee.requiredPPE.includes(item.id);
                  return (
                    <SelectItem key={item.id} value={item.id}>
                      <div className="flex items-center justify-between w-full">
                        <span>{item.type}</span>
                        <div className="flex items-center gap-2 ml-2">
                          {isRequired && (
                            <Badge variant="outline" className="text-xs bg-safety-orange/10">
                              Obrigatório
                            </Badge>
                          )}
                          <Badge variant="outline" className="text-xs">
                            {availableCount} disponível(is)
                          </Badge>
                        </div>
                      </div>
                    </SelectItem>
                  );
                })}
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
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAssign}
            className="bg-safety-blue hover:bg-safety-blue-dark"
            disabled={!selectedPPEId}
          >
            Atribuir EPI
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};