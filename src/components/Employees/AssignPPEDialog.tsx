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
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useCatalog } from '@/hooks/useCatalog';
import { useInventory } from '@/hooks/useInventory';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Check, Package, Info } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AssignPPEDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
}

export const AssignPPEDialog = ({ open, onOpenChange, employee }: AssignPPEDialogProps) => {
  const { toast } = useToast();
  const { catalogItems } = useCatalog();
  const { assignPPEToEmployee, getAvailableInstances, getInstanceDetails } = useInventory();
  
  const [selectedPPEIds, setSelectedPPEIds] = useState<string[]>([]);
  const [reason, setReason] = useState<string>('');

  if (!employee) return null;

  // Get PPE types that the employee needs but doesn't have assigned
  const missingRequiredPPE = employee.requiredPPE.filter(requiredId => {
    return !employee.assignedPPE.some(assignedId => {
      const details = getInstanceDetails(assignedId);
      return details?.catalogItem?.id === requiredId;
    });
  });

  // Get all available PPE options
  const availablePPEOptions = catalogItems.filter(item => {
    const availableInstances = getAvailableInstances(item.id);
    return availableInstances.length > 0 && item.currentStock > 0;
  });

  // Separate required vs optional PPE
  const requiredPPE = availablePPEOptions.filter(item => 
    employee.requiredPPE.includes(item.id) && missingRequiredPPE.includes(item.id)
  );
  
  const optionalPPE = availablePPEOptions.filter(item => 
    !employee.requiredPPE.includes(item.id)
  );

  const handlePPEToggle = (ppeId: string, checked: boolean) => {
    if (checked) {
      setSelectedPPEIds(prev => [...prev, ppeId]);
    } else {
      setSelectedPPEIds(prev => prev.filter(id => id !== ppeId));
    }
  };

  const handleAssignMultiple = async () => {
    if (selectedPPEIds.length === 0) {
      toast({
        title: "Erro",
        description: "Selecione pelo menos um EPI para atribuir.",
        variant: "destructive",
      });
      return;
    }

    let successCount = 0;
    let totalCount = selectedPPEIds.length;

    for (const ppeId of selectedPPEIds) {
      const success = await assignPPEToEmployee(
        ppeId,
        employee.id,
        employee,
        reason || 'Entrega padrão'
      );
      if (success) successCount++;
    }

    if (successCount === totalCount) {
      toast({
        title: "Sucesso",
        description: `${successCount} EPI(s) atribuído(s) com sucesso a ${employee.name}.`,
      });
      setSelectedPPEIds([]);
      setReason('');
      onOpenChange(false);
    } else if (successCount > 0) {
      toast({
        title: "Parcialmente concluído",
        description: `${successCount} de ${totalCount} EPIs foram atribuídos. Verifique o estoque dos demais.`,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Erro",
        description: "Não foi possível atribuir nenhum EPI. Verifique o estoque disponível.",
        variant: "destructive",
      });
    }
  };

  const PPECheckboxItem = ({ item, isRequired = false }: { item: any, isRequired?: boolean }) => {
    const availableCount = getAvailableInstances(item.id).length;
    const isSelected = selectedPPEIds.includes(item.id);
    
    return (
      <div className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-muted/50 transition-colors">
        <Checkbox
          id={`ppe-${item.id}`}
          checked={isSelected}
          onCheckedChange={(checked) => handlePPEToggle(item.id, checked as boolean)}
        />
        <div className="flex-1 space-y-1">
          <div className="flex items-center justify-between">
            <Label 
              htmlFor={`ppe-${item.id}`} 
              className="text-sm font-medium cursor-pointer"
            >
              {item.type}
            </Label>
            <div className="flex items-center gap-2">
              {isRequired && (
                <Badge variant="outline" className="text-xs bg-safety-orange/10 border-safety-orange">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Obrigatório
                </Badge>
              )}
              <Badge variant="outline" className="text-xs">
                <Package className="w-3 h-3 mr-1" />
                {availableCount} disponível(is)
              </Badge>
            </div>
          </div>
          {item.description && (
            <p className="text-xs text-muted-foreground">{item.description}</p>
          )}
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span>Marca: {item.brand}</span>
            <span>CA: {item.caNumber}</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Atribuir EPIs - {employee.name}
          </DialogTitle>
          <DialogDescription>
            Selecione os equipamentos de proteção que deseja atribuir ao colaborador
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status atual */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Status Atual</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>EPIs já atribuídos:</span>
                <Badge variant="outline">{employee.assignedPPE.length}</Badge>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>EPIs obrigatórios pendentes:</span>
                <Badge variant={missingRequiredPPE.length > 0 ? "destructive" : "secondary"}>
                  {missingRequiredPPE.length}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Lista de EPIs */}
          <ScrollArea className="h-[300px] w-full">
            <div className="space-y-4">
              {/* EPIs Obrigatórios */}
              {requiredPPE.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-safety-orange" />
                    <h4 className="font-medium text-safety-orange">EPIs Obrigatórios Pendentes</h4>
                  </div>
                  <div className="space-y-2">
                    {requiredPPE.map((item) => (
                      <PPECheckboxItem key={`required-${item.id}`} item={item} isRequired={true} />
                    ))}
                  </div>
                </div>
              )}

              {requiredPPE.length > 0 && optionalPPE.length > 0 && <Separator />}

              {/* EPIs Opcionais */}
              {optionalPPE.length > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-primary" />
                    <h4 className="font-medium">EPIs Opcionais Disponíveis</h4>
                  </div>
                  <div className="space-y-2">
                    {optionalPPE.map((item) => (
                      <PPECheckboxItem key={`optional-${item.id}`} item={item} />
                    ))}
                  </div>
                </div>
              )}

              {availablePPEOptions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Nenhum EPI disponível em estoque</p>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Resumo da seleção */}
          {selectedPPEIds.length > 0 && (
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">EPIs selecionados:</span>
                  <Badge className="bg-primary">
                    <Check className="w-3 h-3 mr-1" />
                    {selectedPPEIds.length}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedPPEIds.map(ppeId => {
                    const item = catalogItems.find(cat => cat.id === ppeId);
                    return (
                      <Badge key={ppeId} variant="outline" className="text-xs">
                        {item?.type}
                      </Badge>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Motivo */}
          <div className="space-y-2">
            <Label htmlFor="reason">Motivo da Entrega</Label>
            <Textarea
              id="reason"
              placeholder="Informe o motivo da entrega (opcional)..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="min-h-[60px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            onClick={handleAssignMultiple}
            className="bg-safety-blue hover:bg-safety-blue-dark"
            disabled={selectedPPEIds.length === 0}
          >
            <Check className="w-4 h-4 mr-2" />
            Atribuir {selectedPPEIds.length > 0 ? `${selectedPPEIds.length} EPI(s)` : 'EPIs'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};