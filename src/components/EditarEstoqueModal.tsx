import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';

interface ItemEstoque {
  id: number;
  nome: string;
  valorUn: number;
  ca: string;
  quantidade: number;
  fornecedor: string;
  validade: string;
  status?: string;
}

interface EditarEstoqueModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvar: (item: ItemEstoque) => void;
  item: ItemEstoque;
}

const EditarEstoqueModal = ({ isOpen, onClose, onSalvar, item }: EditarEstoqueModalProps) => {
  // Converter a data de DD/MM/AAAA para AAAA-MM-DD (formato do input date)
  const converterDataParaInputDate = (dataString: string): string => {
    if (!dataString) return '';
    
    // Verifica se já está no formato AAAA-MM-DD
    if (dataString.includes('-')) return dataString;
    
    const partesData = dataString.split('/');
    if (partesData.length !== 3) return '';
    
    return `${partesData[2]}-${partesData[1].padStart(2, '0')}-${partesData[0].padStart(2, '0')}`;
  };
  
  // Converter a data de AAAA-MM-DD para DD/MM/AAAA
  const converterDataParaExibicao = (dataString: string): string => {
    if (!dataString) return '';
    
    // Verifica se já está no formato DD/MM/AAAA
    if (dataString.includes('/')) return dataString;
    
    const data = new Date(dataString);
    return `${data.getDate().toString().padStart(2, '0')}/${(data.getMonth() + 1).toString().padStart(2, '0')}/${data.getFullYear()}`;
  };
  
  // Preparar valores iniciais, convertendo a data para o formato do input se necessário
  const valoresIniciais = {
    ...item,
    validade: converterDataParaInputDate(item.validade)
  };
  
  const { register, handleSubmit, formState: { errors } } = useForm<ItemEstoque>({
    defaultValues: valoresIniciais
  });

  const onSubmit = (data: ItemEstoque) => {
    const itemAtualizado = {
      ...item,
      valorUn: Number(data.valorUn),
      quantidade: Number(data.quantidade),
      validade: converterDataParaExibicao(data.validade)
    };
    onSalvar(itemAtualizado);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Item do Estoque</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 bg-gray-50 p-4 rounded-md">
            <div className="space-y-1">
              <Label className="text-sm text-gray-500">Nome do EPI</Label>
              <p className="font-medium">{item.nome}</p>
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
              />
              {errors.valorUn && <span className="text-sm text-red-500">{errors.valorUn.message}</span>}
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm text-gray-500">Número CA</Label>
              <p className="font-medium">{item.ca}</p>
            </div>
            
            <div className="space-y-1">
              <Label className="text-sm text-gray-500">Fornecedor</Label>
              <p className="font-medium">{item.fornecedor}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 gap-4 mt-4">
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
                min="1"
                step="1"
              />
              {errors.quantidade && <span className="text-sm text-red-500">{errors.quantidade.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="validade">Data de Validade</Label>
              <Input
                id="validade"
                type="date"
                {...register("validade", { required: "Data de validade é obrigatória" })}
              />
              {errors.validade && <span className="text-sm text-red-500">{errors.validade.message}</span>}
            </div>
            
            {item.status && (
              <div className="space-y-1">
                <Label className="text-sm text-gray-500">Status Atual</Label>
                <p className={`font-medium ${
                  item.status === 'Vencido' 
                    ? 'text-red-600' 
                    : item.status === 'Próximo ao vencimento'
                    ? 'text-amber-600'
                    : 'text-green-600'
                }`}>
                  {item.status}
                </p>
                <p className="text-xs text-gray-500">
                  O status será atualizado automaticamente ao salvar com base na nova data de validade.
                </p>
              </div>
            )}
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Salvar Alterações</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarEstoqueModal;
