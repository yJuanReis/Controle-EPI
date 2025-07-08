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
import { useInventory } from '@/hooks/useInventory';
import { Badge } from '@/components/ui/badge';

interface ReturnPPEDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export const ReturnPPEDialog = ({ open, onOpenChange, employee }: ReturnPPEDialogProps) => {
  const { toast } = useToast();
  const { returnPPEFromEmployee, getInstanceDetails } = useInventory();
  
  const [selectedInstanceId, setSelectedInstanceId] = useState<string>('');
  const [reason, setReason] = useState<string>('');

  if (!employee || employee.assignedPPE.length === 0) return null;

  const handleReturn = async () => {
    if (!selectedInstanceId) {
      toast({
        title: "Erro",
        description: "Selecione um EPI para devolver.",
        variant: "destructive",
      });
      return;
    }

    const success = await returnPPEFromEmployee(
      selectedInstanceId,
      employee.id,
      employee,
      reason || 'Devolução'
    );

    if (success) {
      toast({
        title: "Sucesso",
        description: `EPI devolvido com sucesso por ${employee.name}.`,
      });
      setSelectedInstanceId('');
      setReason('');
      onOpenChange(false);
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível processar a devolução do EPI.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Devolver EPI</DialogTitle>
          <DialogDescription>
            Processar devolução de equipamento de {employee.name}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="instance-select">Selecionar EPI para Devolução</Label>
            <Select value={selectedInstanceId} onValueChange={setSelectedInstanceId}>
              <SelectTrigger id="instance-select">
                <SelectValue placeholder="Escolha um EPI atribuído" />
              </SelectTrigger>
              <SelectContent>
                {employee.assignedPPE.map((instanceId) => {
                  const details = getInstanceDetails(instanceId);
                  if (!details) return null;
                  
                  return (
                    <SelectItem key={instanceId} value={instanceId}>
                      <div className="flex items-center justify-between w-full">
                        <span>{details.catalogItem?.type || 'EPI Desconhecido'}</span>
                        <Badge variant="outline" className="text-xs ml-2">
                          {instanceId}
                        </Badge>
                      </div>
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="return-reason">Motivo da Devolução</Label>
            <Textarea
              id="return-reason"
              placeholder="Informe o motivo da devolução..."
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
            onClick={handleReturn}
            variant="destructive"
            disabled={!selectedInstanceId}
          >
            Processar Devolução
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};