import React, { useState, useEffect } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { useCatalog } from '@/hooks/useCatalog';

interface AddEditEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onSave: (employee: Employee) => void;
}

export const AddEditEmployeeDialog = ({ open, onOpenChange, employee, onSave }: AddEditEmployeeDialogProps) => {
  const { toast } = useToast();
  const { catalogItems } = useCatalog();
  
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    department: '',
    requiredPPE: [] as string[],
    assignedPPE: [] as string[]
  });

  const departments = ['Produção', 'Manutenção', 'Segurança', 'Administração', 'Qualidade'];

  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name,
        position: employee.position,
        department: employee.department,
        requiredPPE: employee.requiredPPE,
        assignedPPE: employee.assignedPPE
      });
    } else {
      setFormData({
        name: '',
        position: '',
        department: '',
        requiredPPE: [],
        assignedPPE: []
      });
    }
  }, [employee, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.position.trim() || !formData.department) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    const employeeData: Employee = {
      id: employee?.id || Date.now().toString(),
      name: formData.name.trim(),
      position: formData.position.trim(),
      department: formData.department,
      requiredPPE: formData.requiredPPE,
      assignedPPE: formData.assignedPPE,
      trainingHistory: employee?.trainingHistory || []
    };

    onSave(employeeData);
    onOpenChange(false);
    
    toast({
      title: employee ? "Colaborador atualizado" : "Colaborador adicionado",
      description: `${employeeData.name} foi ${employee ? 'atualizado' : 'adicionado'} com sucesso.`,
    });
  };

  const handlePPEChange = (ppeId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      requiredPPE: checked 
        ? [...prev.requiredPPE, ppeId]
        : prev.requiredPPE.filter(id => id !== ppeId)
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>
            {employee ? 'Editar Colaborador' : 'Novo Colaborador'}
          </DialogTitle>
          <DialogDescription>
            {employee ? 'Atualize as informações do colaborador.' : 'Adicione um novo colaborador ao sistema.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="Nome completo do colaborador"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="position">Cargo *</Label>
            <Input
              id="position"
              value={formData.position}
              onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
              placeholder="Cargo/função do colaborador"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="department">Departamento *</Label>
            <Select value={formData.department} onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione o departamento" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>EPIs Necessários</Label>
            <div className="max-h-32 overflow-y-auto space-y-2 border rounded p-2">
              {catalogItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`ppe-${item.id}`}
                    checked={formData.requiredPPE.includes(item.id)}
                    onCheckedChange={(checked) => handlePPEChange(item.id, checked as boolean)}
                  />
                  <Label htmlFor={`ppe-${item.id}`} className="text-sm">{item.type}</Label>
                </div>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-safety-blue hover:bg-safety-blue-dark">
              {employee ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};