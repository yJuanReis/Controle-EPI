
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';

interface ItemEstoque {
  nome: string;
  tipo: string;
  ca: string;
  quantidade: number;
  fornecedor: string;
  validade: string;
}

interface AdicionarEstoqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdicionar: (item: ItemEstoque) => void;
}

const AdicionarEstoqueModal = ({ isOpen, onClose, onAdicionar }: AdicionarEstoqueModalProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<ItemEstoque>();

  const onSubmit = (data: ItemEstoque) => {
    onAdicionar(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Item ao Estoque</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome do EPI</Label>
              <Input
                id="nome"
                {...register("nome", { required: "Nome é obrigatório" })}
                placeholder="Ex: Capacete de Segurança"
              />
              {errors.nome && <span className="text-sm text-red-500">{errors.nome.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipo">Tipo/Descrição</Label>
              <Input
                id="tipo"
                {...register("tipo", { required: "Tipo é obrigatório" })}
                placeholder="Ex: Tipo II, Classe B"
              />
              {errors.tipo && <span className="text-sm text-red-500">{errors.tipo.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ca">Número CA</Label>
              <Input
                id="ca"
                {...register("ca", { required: "CA é obrigatório" })}
                placeholder="Ex: 12345"
              />
              {errors.ca && <span className="text-sm text-red-500">{errors.ca.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="quantidade">Quantidade</Label>
              <Input
                id="quantidade"
                type="number"
                {...register("quantidade", { 
                  required: "Quantidade é obrigatória",
                  min: { value: 1, message: "Quantidade deve ser maior que zero" }
                })}
                placeholder="Ex: 25"
              />
              {errors.quantidade && <span className="text-sm text-red-500">{errors.quantidade.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="fornecedor">Fornecedor</Label>
              <Input
                id="fornecedor"
                {...register("fornecedor", { required: "Fornecedor é obrigatório" })}
                placeholder="Ex: 3M Brasil"
              />
              {errors.fornecedor && <span className="text-sm text-red-500">{errors.fornecedor.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="validade">Data de Validade</Label>
              <Input
                id="validade"
                {...register("validade", { required: "Data de validade é obrigatória" })}
                placeholder="DD/MM/AAAA"
              />
              {errors.validade && <span className="text-sm text-red-500">{errors.validade.message}</span>}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Adicionar Item</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdicionarEstoqueModal;
