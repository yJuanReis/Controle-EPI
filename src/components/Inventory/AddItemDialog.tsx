
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ppeCatalog, ppeInstances, updatePPEInstances } from '@/data/mockData';
import { PPEInstance } from '@/types';

interface AddItemDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AddItemDialog: React.FC<AddItemDialogProps> = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const [selectedCatalogItem, setSelectedCatalogItem] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unitValue, setUnitValue] = useState<string>('');
  const [acquisitionDate, setAcquisitionDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  const handleAdd = () => {
    if (!selectedCatalogItem) {
      toast({
        title: "Erro",
        description: "Selecione um tipo de EPI para adicionar.",
        variant: "destructive"
      });
      return;
    }

    try {
      const catalogItem = ppeCatalog.find(item => item.id === selectedCatalogItem);
      if (!catalogItem) {
        throw new Error("Item de catálogo não encontrado");
      }

      const newInstances: PPEInstance[] = [];
      
      // Calculate expiry date based on catalog lifespan
      const acqDate = new Date(acquisitionDate);
      const expiryDate = new Date(acqDate);
      expiryDate.setMonth(expiryDate.getMonth() + catalogItem.lifespanMonths);
      
      // Create instances based on quantity
      for (let i = 0; i < quantity; i++) {
        const newInstance: PPEInstance = {
          id: `inst-${Date.now()}-${i}`,
          catalogItemId: selectedCatalogItem,
          acquisitionDate: acqDate.toISOString().split('T')[0],
          expiryDate: expiryDate.toISOString().split('T')[0],
          status: 'available',
          maintenanceHistory: [],
          unitValue: unitValue ? parseFloat(unitValue) : undefined,
        };
        
        newInstances.push(newInstance);
      }
      
      // Update instances list
      const updatedInstances = [...ppeInstances, ...newInstances];
      const success = updatePPEInstances(updatedInstances);
      
      if (success) {
        toast({
          title: "Sucesso",
          description: `${quantity} ${catalogItem.type}(s) adicionado(s) ao estoque.`
        });
        
        // Reset form
        setSelectedCatalogItem('');
        setQuantity(1);
        setUnitValue('');
        
        onClose();
      } else {
        throw new Error("Não foi possível salvar os dados");
      }
    } catch (error) {
      console.error("Erro ao adicionar item:", error);
      toast({
        title: "Erro",
        description: "Não foi possível adicionar o item ao estoque.",
        variant: "destructive"
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Item ao Estoque</DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ppe-type">Tipo de EPI</Label>
            <Select value={selectedCatalogItem} onValueChange={setSelectedCatalogItem}>
              <SelectTrigger id="ppe-type">
                <SelectValue placeholder="Selecione um tipo de EPI" />
              </SelectTrigger>
              <SelectContent>
                {ppeCatalog.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.type} - CA: {item.approvalNumber}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="quantity">Quantidade</Label>
            <Input 
              id="quantity" 
              type="number" 
              min="1"
              value={quantity} 
              onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="unitValue">Valor Unitário (R$)</Label>
            <Input 
              id="unitValue" 
              type="text" 
              placeholder="0,00"
              value={unitValue}
              onChange={(e) => {
                const value = e.target.value.replace(',', '.');
                if (!isNaN(parseFloat(value)) || value === '' || value.endsWith('.')) {
                  setUnitValue(value);
                }
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="acquisitionDate">Data de Aquisição</Label>
            <Input 
              id="acquisitionDate" 
              type="date" 
              value={acquisitionDate}
              onChange={(e) => setAcquisitionDate(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleAdd}>Adicionar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
