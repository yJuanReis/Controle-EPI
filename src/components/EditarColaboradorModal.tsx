
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X } from 'lucide-react';

interface Colaborador {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  epi: string[];
  status: 'ativo' | 'afastado' | 'férias';
}

interface EditarColaboradorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvar: (colaborador: Colaborador) => void;
  colaborador: Colaborador;
}

const EditarColaboradorModal = ({ isOpen, onClose, onSalvar, colaborador }: EditarColaboradorModalProps) => {
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Colaborador>({
    defaultValues: colaborador
  });

  const [epiList, setEpiList] = useState<string[]>(colaborador.epi || []);
  const [novoEpi, setNovoEpi] = useState('');

  // Registra o campo status manualmente devido ao componente Select
  const onStatusChange = (value: 'ativo' | 'afastado' | 'férias') => {
    setValue('status', value);
  };

  const adicionarEpi = () => {
    if (novoEpi.trim() !== '' && !epiList.includes(novoEpi)) {
      const novosEpis = [...epiList, novoEpi];
      setEpiList(novosEpis);
      setValue('epi', novosEpis);
      setNovoEpi('');
    }
  };

  const removerEpi = (index: number) => {
    const novosEpis = [...epiList];
    novosEpis.splice(index, 1);
    setEpiList(novosEpis);
    setValue('epi', novosEpis);
  };

  const onSubmit = (data: Colaborador) => {
    onSalvar({...data, id: colaborador.id, epi: epiList});
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Colaborador</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo</Label>
              <Input
                id="nome"
                {...register("nome", { required: "Nome é obrigatório" })}
              />
              {errors.nome && <span className="text-sm text-red-500">{errors.nome.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                {...register("cargo", { required: "Cargo é obrigatório" })}
              />
              {errors.cargo && <span className="text-sm text-red-500">{errors.cargo.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="departamento">Departamento</Label>
              <Input
                id="departamento"
                {...register("departamento", { required: "Departamento é obrigatório" })}
              />
              {errors.departamento && <span className="text-sm text-red-500">{errors.departamento.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="dataAdmissao">Data de Admissão</Label>
              <Input
                id="dataAdmissao"
                {...register("dataAdmissao", { required: "Data de admissão é obrigatória" })}
              />
              {errors.dataAdmissao && <span className="text-sm text-red-500">{errors.dataAdmissao.message}</span>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select defaultValue={colaborador.status} onValueChange={onStatusChange}>
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
              <Label htmlFor="epis">EPIs</Label>
              <div className="flex gap-2">
                <Input
                  id="epis"
                  value={novoEpi}
                  onChange={(e) => setNovoEpi(e.target.value)}
                  placeholder="Adicionar EPI"
                  className="flex-grow"
                />
                <Button type="button" onClick={adicionarEpi}>Adicionar</Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-2">
                {epiList.map((epi, index) => (
                  <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1 pl-3">
                    {epi}
                    <button 
                      type="button" 
                      onClick={() => removerEpi(index)}
                      className="ml-1 rounded-full hover:bg-gray-200 p-1"
                    >
                      <X size={12} />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
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

export default EditarColaboradorModal;
