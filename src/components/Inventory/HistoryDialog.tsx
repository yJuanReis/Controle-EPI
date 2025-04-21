
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface HistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  itemId: string;
}

export const HistoryDialog: React.FC<HistoryDialogProps> = ({ isOpen, onClose, itemId }) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Histórico do Item</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            ID do Item: {itemId}
          </p>
          <p className="mt-2 text-sm">
            Histórico em desenvolvimento.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
