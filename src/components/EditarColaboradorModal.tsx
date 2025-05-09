
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from '@/components/ui/date-picker';
import { X } from 'lucide-react';

interface EPI {
  id: number;
  nome: string;
  ca: string;
  validade: string;
  fornecedor: string;
  status: string;
}

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

// Simulação de EPIs disponíveis no sistema
const episDisponiveis: EPI[] = [
  { id: 1, nome: "Capacete de Segurança", ca: "12345", validade: "15/12/2023", fornecedor: "3M Brasil", status: "Próximo ao vencimento" },
  { id: 2, nome: "Luvas de Proteção", ca: "23456", validade: "20/06/2024", fornecedor: "Ansell Healthcare", status: "Ativo" },
  { id: 3, nome: "Óculos de Proteção", ca: "34567", validade: "10/03/2023", fornecedor: "MSA Safety", status: "Vencido" },
  { id: 4, nome: "Respirador Semi-facial", ca: "45678", validade: "05/09/2024", fornecedor: "3M Brasil", status: "Ativo" },
];

const EditarColaboradorModal = ({ isOpen, onClose, onSalvar, colaborador }: EditarColaboradorModalProps) => {
  // Converte a string dataAdmissao para um objeto Date
  const parseDateString = (dateStr: string): Date | undefined => {
    const parts = dateStr.split('/');
    if (parts.length !== 3) return undefined;
    
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mês é 0-indexado em JS
    const year = parseInt(parts[2], 10);
    
    return new Date(year, month, day);
  };
  
  const [initialDate, setInitialDate] = useState<Date | undefined>(parseDateString(colaborador.dataAdmissao));
  const [selectedEPIs, setSelectedEPIs] = useState<string[]>(colaborador.epi || []);
  
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<Colaborador>({
    defaultValues: colaborador
  });

  // Atualiza o campo dataAdmissao quando o date picker muda
  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
      setValue('dataAdmissao', formattedDate);
      setInitialDate(date);
    }
  };

  // Registra o campo status manualmente devido ao componente Select
  const onStatusChange = (value: 'ativo' | 'afastado' | 'férias') => {
    setValue('status', value);
  };

  // Gerencia a seleção de EPIs
  const toggleEPI = (epiNome: string) => {
    setSelectedEPIs(prevSelected => {
      if (prevSelected.includes(epiNome)) {
        const updated = prevSelected.filter(item => item !== epiNome);
        setValue('epi', updated);
        return updated;
      } else {
        const updated = [...prevSelected, epiNome];
        setValue('epi', updated);
        return updated;
      }
    });
  };

  const onSubmit = (data: Colaborador) => {
    onSalvar({...data, id: colaborador.id, epi: selectedEPIs});
  };

  useEffect(() => {
    setValue('epi', selectedEPIs);
  }, [selectedEPIs, setValue]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Editar Colaborador</DialogTitle>
          <DialogDescription>
            Atualize os dados do colaborador conforme necessário.
          </DialogDescription>
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
              <DatePicker 
                date={initialDate} 
                setDate={handleDateChange} 
                placeholder="DD/MM/AAAA"
              />
              <input
                type="hidden"
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
              <Label>EPIs</Label>
              <div className="space-y-4">
                <div className="border rounded-md p-3">
                  <div className="mb-3 font-medium text-sm">Selecione os EPIs para este colaborador:</div>
                  <div className="space-y-2">
                    {episDisponiveis.map((epi) => (
                      <div key={epi.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`epi-${epi.id}`} 
                          checked={selectedEPIs.includes(epi.nome)}
                          onCheckedChange={() => toggleEPI(epi.nome)}
                        />
                        <label 
                          htmlFor={`epi-${epi.id}`}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          {epi.nome} - CA: {epi.ca}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium mb-2">EPIs selecionados:</div>
                  <div className="flex flex-wrap gap-2">
                    {selectedEPIs.map((epi, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1 py-1 pl-3">
                        {epi}
                        <button 
                          type="button" 
                          onClick={() => toggleEPI(epi)}
                          className="ml-1 rounded-full hover:bg-gray-200 p-1"
                        >
                          <X size={12} />
                        </button>
                      </Badge>
                    ))}
                    {selectedEPIs.length === 0 && (
                      <div className="text-sm text-gray-500">Nenhum EPI selecionado</div>
                    )}
                  </div>
                </div>
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
