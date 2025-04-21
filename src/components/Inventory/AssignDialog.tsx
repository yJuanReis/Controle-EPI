
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface AssignDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
}

export const AssignDialog: React.FC<AssignDialogProps> = ({ isOpen, onClose, itemId }) => {
  const { toast } = useToast();

  const handleAssign = () => {
    toast({
      title: "Em desenvolvimento",
      description: "A funcionalidade de atribuição será implementada em breve.",
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Atribuir EPI</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            ID do Item: {itemId}
          </p>
          <p className="mt-2 text-sm">
            Formulário de atribuição em desenvolvimento.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleAssign}>Atribuir</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
