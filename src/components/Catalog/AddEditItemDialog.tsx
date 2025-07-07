import React, { useState, useEffect } from 'react';
import { PPEItem } from '@/types';
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

interface AddEditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: PPEItem | null;
  onSave: (item: PPEItem) => void;
}

const departments = [
  'Náutica',
  'Manutenção',
  'Administração',
  'Segurança',
  'Limpeza',
  'Operações'
];

const ppeTypes = [
  'Capacete',
  'Óculos de Proteção',
  'Protetor Auricular',
  'Máscara',
  'Luvas',
  'Colete Salva-vidas',
  'Calçado de Segurança',
  'Cinto de Segurança',
  'Uniforme',
  'Outros'
];

export const AddEditItemDialog = ({ open, onOpenChange, item, onSave }: AddEditItemDialogProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<PPEItem>>({
    type: '',
    description: '',
    approvalNumber: '',
    supplier: '',
    department: '',
    imageUrl: '',
    lifespanMonths: 12,
    minimumStock: 10,
    currentStock: 0,
  });

  const isEditing = !!item;

  useEffect(() => {
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        type: '',
        description: '',
        approvalNumber: '',
        supplier: '',
        department: '',
        imageUrl: '',
        lifespanMonths: 12,
        minimumStock: 10,
        currentStock: 0,
      });
    }
  }, [item, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.description || !formData.approvalNumber || !formData.supplier || !formData.department) {
      toast({
        title: "Erro",
        description: "Todos os campos obrigatórios devem ser preenchidos.",
        variant: "destructive",
      });
      return;
    }

    const newItem: PPEItem = {
      id: item?.id || `epi-${Date.now()}`,
      type: formData.type,
      description: formData.description,
      approvalNumber: formData.approvalNumber,
      supplier: formData.supplier,
      department: formData.department,
      imageUrl: formData.imageUrl || '/placeholder.svg',
      lifespanMonths: formData.lifespanMonths || 12,
      minimumStock: formData.minimumStock || 10,
      currentStock: formData.currentStock || 0,
    };

    onSave(newItem);
    onOpenChange(false);
    
    toast({
      title: isEditing ? "EPI atualizado" : "EPI adicionado",
      description: isEditing ? 
        "O equipamento foi atualizado com sucesso." : 
        "O novo equipamento foi adicionado ao catálogo.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? 'Editar EPI' : 'Adicionar Novo EPI'}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? 
              'Edite as informações do equipamento de proteção individual.' :
              'Adicione um novo equipamento de proteção individual ao catálogo.'
            }
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Tipo *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {ppeTypes.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="approvalNumber">Nº CA *</Label>
              <Input
                id="approvalNumber"
                value={formData.approvalNumber || ''}
                onChange={(e) => setFormData({ ...formData, approvalNumber: e.target.value })}
                placeholder="Ex: 12345"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Input
              id="description"
              value={formData.description || ''}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descrição detalhada do EPI"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplier">Fornecedor *</Label>
              <Input
                id="supplier"
                value={formData.supplier || ''}
                onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                placeholder="Nome do fornecedor"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="department">Departamento *</Label>
              <Select 
                value={formData.department} 
                onValueChange={(value) => setFormData({ ...formData, department: value })}
              >
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
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lifespanMonths">Validade (meses)</Label>
              <Input
                id="lifespanMonths"
                type="number"
                value={formData.lifespanMonths || 12}
                onChange={(e) => setFormData({ ...formData, lifespanMonths: parseInt(e.target.value) })}
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="minimumStock">Estoque Mínimo</Label>
              <Input
                id="minimumStock"
                type="number"
                value={formData.minimumStock || 10}
                onChange={(e) => setFormData({ ...formData, minimumStock: parseInt(e.target.value) })}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="currentStock">Estoque Atual</Label>
              <Input
                id="currentStock"
                type="number"
                value={formData.currentStock || 0}
                onChange={(e) => setFormData({ ...formData, currentStock: parseInt(e.target.value) })}
                min="0"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-safety-blue hover:bg-safety-blue-dark">
              {isEditing ? 'Atualizar' : 'Adicionar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};