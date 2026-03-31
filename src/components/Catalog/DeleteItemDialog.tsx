import React from 'react';
import { PPEItem } from '@/types';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface DeleteItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: PPEItem | null;
  onDelete: (itemId: string) => void;
}

export const DeleteItemDialog = ({ open, onOpenChange, item, onDelete }: DeleteItemDialogProps) => {
  const { toast } = useToast();

  const handleDelete = () => {
    if (item) {
      onDelete(item.id);
      onOpenChange(false);
      toast({
        title: "EPI removido",
        description: `${item.type} foi removido do catálogo com sucesso.`,
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir <strong>{item?.type}</strong> do catálogo?
            <br />
            <span className="text-destructive font-medium">
              Esta ação não pode ser desfeita.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction 
            onClick={handleDelete}
            className="bg-destructive hover:bg-destructive/90"
          >
            Excluir
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};