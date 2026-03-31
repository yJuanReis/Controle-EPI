import React from 'react';
import { Employee } from '@/types';
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

interface DeleteEmployeeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  employee: Employee | null;
  onDelete: (employeeId: string) => void;
}

export const DeleteEmployeeDialog = ({ open, onOpenChange, employee, onDelete }: DeleteEmployeeDialogProps) => {
  const { toast } = useToast();

  const handleDelete = () => {
    if (employee) {
      onDelete(employee.id);
      onOpenChange(false);
      toast({
        title: "Colaborador removido",
        description: `${employee.name} foi removido do sistema com sucesso.`,
      });
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
          <AlertDialogDescription>
            Tem certeza que deseja excluir <strong>{employee?.name}</strong> do sistema?
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