
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Colaborador {
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  epi: string[];
  status: 'ativo' | 'afastado' | 'férias';
}

interface AdicionarColaboradorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdicionar: (colaborador: Colaborador) => void;
}

const AdicionarColaboradorModal = ({ isOpen, onClose, onAdicionar }: AdicionarColaboradorModalProps) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Colaborador>({
    defaultValues: {
      status: 'ativo',
      epi: []
    }
  });

  // Registra o campo status manualmente devido ao componente Select
  const onStatusChange = (value: 'ativo' | 'afastado' | 'férias') => {
    setValue('status', value);
  };

  const onSubmit = (data: Colaborador) => {
    // Simulando a seleção de EPIs (em produção real, isso viria de uma lista de seleção)
    if (!data.epi || !data.epi.length) {
      data.epi = []; // Garante que sempre seja um array, mesmo que vazio
    }
    onAdicionar(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                {...register("nome", { required: "Nome é obrigatório" })}
                placeholder="Ex: João Silva"
              />
              {errors.nome && <span className="text-sm text-red-500">{errors.nome.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                {...register("cargo", { required: "Cargo é obrigatório" })}
                placeholder="Ex: Operador"
              />
              {errors.cargo && <span className="text-sm text-red-500">{errors.cargo.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                {...register("departamento", { required: "Departamento é obrigatório" })}
                placeholder="Ex: Produção"
              />
              {errors.departamento && <span className="text-sm text-red-500">{errors.departamento.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataAdmissao">Data de Admissão</Label>
              <Input
                id="dataAdmissao"
                {...register("dataAdmissao", { required: "Data de admissão é obrigatória" })}
                placeholder="DD/MM/AAAA"
              />
              {errors.dataAdmissao && <span className="text-sm text-red-500">{errors.dataAdmissao.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue="ativo" onValueChange={onStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione um status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="afastado">Afastado</SelectItem>
                  <SelectItem value="férias">Férias</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>EPIs (Serão atribuídos posteriormente)</Label>
              <p className="text-sm text-gray-500">
                Após cadastrar o colaborador, você poderá atribuir EPIs específicos.
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit">Adicionar Colaborador</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AdicionarColaboradorModal;
