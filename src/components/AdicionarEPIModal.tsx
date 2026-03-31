import React from 'react';
import { useForm } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { useEPI } from '../contexts/EPIContext';
import { useToast } from '@/hooks/use-toast';

interface AdicionarEPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  epiParaEditar?: {
    id: number;
    nome: string;
    valorUn: number;
    ca: string;
    quantidade: number;
    fornecedor: string;
    validade: string;
    status?: string;
    valor: number;
  };
}

const AdicionarEPIModal = ({ isOpen, onClose, epiParaEditar }: AdicionarEPIModalProps) => {
  const { addEPI, updateEPI } = useEPI();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset, watch, setValue } = useForm({
    defaultValues: epiParaEditar || {
      nome: '',
      valorUn: 0,
      ca: '',
      quantidade: 0,
      fornecedor: '',
      validade: '',
      status: 'Ativo'
    }
  });

  // Observa mudanças no valorUn e quantidade para calcular o valor total
  const valorUn = watch('valorUn');
  const quantidade = watch('quantidade');

  React.useEffect(() => {
    const valorTotal = Number(valorUn) * Number(quantidade);
    setValue('valor', valorTotal);
  }, [valorUn, quantidade, setValue]);

  const onSubmit = (data: any) => {
    const valorTotal = Number(data.valorUn) * Number(data.quantidade);
    const dadosFinais = {
      ...data,
      valor: valorTotal,
      valorUn: Number(data.valorUn),
      quantidade: Number(data.quantidade)
    };

    if (epiParaEditar) {
      updateEPI({ ...dadosFinais, id: epiParaEditar.id });
      toast({
        title: "EPI atualizado",
        description: "O EPI foi atualizado com sucesso.",
      });
    } else {
      addEPI(dadosFinais);
      toast({
        title: "EPI adicionado",
        description: "O novo EPI foi adicionado com sucesso.",
      });
    }
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{epiParaEditar ? 'Editar EPI' : 'Adicionar Item ao Estoque'}</DialogTitle>
          <DialogDescription>
            {epiParaEditar 
              ? 'Edite as informações do EPI abaixo.'
              : 'Preencha as informações do novo item abaixo.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do EPI</Label>
              <Input
                id="nome"
                placeholder="Ex: Capacete de Segurança"
                {...register('nome', { required: 'Nome é obrigatório' })}
                className={errors.nome ? 'border-red-500' : ''}
              />
              {errors.nome && (
                <span className="text-sm text-red-500">{errors.nome.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valorUn">Valor UN (R$)</Label>
              <Input
                id="valorUn"
                type="number"
                step="0.01"
                placeholder="Ex: 45.90"
                {...register('valorUn', { 
                  required: 'Valor UN é obrigatório',
                  min: { value: 0, message: 'Valor UN não pode ser negativo' }
                })}
                className={errors.valorUn ? 'border-red-500' : ''}
              />
              {errors.valorUn && (
                <span className="text-sm text-red-500">{errors.valorUn.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="ca">Número CA</Label>
              <Input
                id="ca"
                placeholder="Ex: 12345"
                {...register('ca', { required: 'CA é obrigatório' })}
                className={errors.ca ? 'border-red-500' : ''}
              />
              {errors.ca && (
                <span className="text-sm text-red-500">{errors.ca.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                placeholder="Ex: 25"
                {...register('quantidade', { 
                  required: 'Quantidade é obrigatória',
                  min: { value: 0, message: 'Quantidade não pode ser negativa' }
                })}
                className={errors.quantidade ? 'border-red-500' : ''}
              />
              {errors.quantidade && (
                <span className="text-sm text-red-500">{errors.quantidade.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input
                id="fornecedor"
                placeholder="Ex: 3M Brasil"
                {...register('fornecedor', { required: 'Fornecedor é obrigatório' })}
                className={errors.fornecedor ? 'border-red-500' : ''}
              />
              {errors.fornecedor && (
                <span className="text-sm text-red-500">{errors.fornecedor.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="validade">Data de Validade</Label>
              <Input
                id="validade"
                type="date"
                {...register('validade', { required: 'Data de validade é obrigatória' })}
                className={errors.validade ? 'border-red-500' : ''}
              />
              {errors.validade && (
                <span className="text-sm text-red-500">{errors.validade.message}</span>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor Total (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                disabled
                {...register('valor')}
                className="bg-gray-100"
              />
              <span className="text-sm text-gray-500">Calculado automaticamente (Valor UN × Quantidade)</span>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                reset();
                onClose();
              }}
            >
              Cancelar
            </Button>
            <Button type="submit">
              {epiParaEditar ? 'Salvar Alterações' : 'Adicionar Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdicionarEPIModal; 