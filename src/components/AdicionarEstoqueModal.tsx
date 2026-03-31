import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';

interface ItemEstoque {
  nome: string;
  valorUn: number;
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

  // Converter a data de AAAA-MM-DD para DD/MM/AAAA
  const converterDataParaExibicao = (dataString: string): string => {
    if (!dataString) return '';
    
    // Verifica se já está no formato DD/MM/AAAA
    if (dataString.includes('/')) return dataString;
    
    const data = new Date(dataString);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
  };

  const onSubmit = (data: ItemEstoque) => {
    // Garantir que a quantidade seja um número e a data no formato correto
    const itemProcessado = {
      ...data,
      quantidade: Number(data.quantidade),
      validade: converterDataParaExibicao(data.validade)
    };
    onAdicionar(itemProcessado);
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
              <Label htmlFor="valorUn">Valor UN (R$)</Label>
              <Input
                id="valorUn"
                type="number"
                step="0.01"
                {...register("valorUn", { 
                  required: "Valor UN é obrigatório",
                  min: { value: 0, message: "Valor UN não pode ser negativo" },
                  valueAsNumber: true
                })}
                placeholder="Ex: 45.90"
              />
              {errors.valorUn && <span className="text-sm text-red-500">{errors.valorUn.message}</span>}
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
                  min: { value: 1, message: "Quantidade deve ser maior que zero" },
                  valueAsNumber: true
                })}
                placeholder="Ex: 25"
                min="1"
                step="1"
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
                type="date"
                {...register("validade", { required: "Data de validade é obrigatória" })}
              />
              {errors.validade && <span className="text-sm text-red-500">{errors.validade.message}</span>}
              <p className="text-xs text-gray-500">
                O status do item será definido automaticamente com base na data de validade.
              </p>
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
