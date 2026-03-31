import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useForm } from 'react-hook-form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DatePicker } from '@/components/ui/date-picker';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { useEPI } from '../contexts/EPIContext';

// Lista de marinas disponíveis
const MARINAS = [
  'Holding',
  'Marina Verolme S/A',
  'Marina Piratas S/A',
  'BR Marinas Itacuruca Ltda.',
  'Marina Porto Bracuhy S.A',
  'Marina Ribeira Ltda.',
  'Marina Refugio de Paraty Ltda.',
  'BR Marinas Gloria S/A',
  'BRM Buzios Marina Ltda.',
  'BR Marinas JL Bracuhy S.A',
  'BR Marinas Boa Vista Ltda'
];

interface Colaborador {
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: 'ativo' | 'afastado' | 'férias';
  marina: string;
}

interface EPIAtribuicao {
  epiId: number;
  nome: string;
  ca: string;
  validade: string;
}

interface AdicionarColaboradorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdicionar: (colaborador: Colaborador) => number;
}

const AdicionarColaboradorModal = ({ isOpen, onClose, onAdicionar }: AdicionarColaboradorModalProps) => {
  const { epis, atribuirEPI } = useEPI();
  const [selectedEPIs, setSelectedEPIs] = useState<EPIAtribuicao[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<Colaborador>({
    defaultValues: {
      status: 'ativo',
      dataAdmissao: '',
      marina: ''
    }
  });

  // Registra o campo status manualmente devido ao componente Select
  const onStatusChange = (value: 'ativo' | 'afastado' | 'férias') => {
    setValue('status', value);
  };

  // Atualiza o campo dataAdmissao quando o date picker muda
  useEffect(() => {
    if (selectedDate) {
      const formattedDate = `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}`;
      setValue('dataAdmissao', formattedDate);
    }
  }, [selectedDate, setValue]);

  // Adiciona ou remove um EPI da lista de selecionados
  const toggleEPI = (epi: { id: number; nome: string; ca: string; validade: string; }) => {
    setSelectedEPIs(prevSelected => {
      const isAlreadySelected = prevSelected.find(item => item.epiId === epi.id);
      
      if (isAlreadySelected) {
        return prevSelected.filter(item => item.epiId !== epi.id);
      } else {
        // Usa a validade do EPI do estoque
        return [...prevSelected, { 
          epiId: epi.id, 
          nome: epi.nome, 
          ca: epi.ca,
          validade: epi.validade
        }];
      }
    });
  };

  // Atualiza a validade de um EPI selecionado
  const atualizarValidadeEPI = (epiId: number, novaValidade: string) => {
    setSelectedEPIs(prev => 
      prev.map(epi => 
        epi.epiId === epiId 
          ? { ...epi, validade: novaValidade }
          : epi
      )
    );
  };

  const onSubmit = async (data: Colaborador) => {
    // Primeiro adiciona o colaborador e obtém o ID
    const novoColaboradorId = onAdicionar(data);
    
    // Atribui cada EPI selecionado ao colaborador usando o ID real
    selectedEPIs.forEach(epi => {
      atribuirEPI(epi.epiId, novoColaboradorId, epi.validade);
    });
    
    // Limpa o formulário
    reset();
    setSelectedEPIs([]);
    setSelectedDate(undefined);
  };

  // Filtra EPIs disponíveis (quantidade > 0)
  const episDisponiveis = epis.filter(epi => epi.quantidade > 0);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Adicionar Novo Colaborador</DialogTitle>
          <DialogDescription>
            Preencha os campos abaixo para cadastrar um novo colaborador.
          </DialogDescription>
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
              <Label htmlFor="marina">Marina</Label>
              <Select onValueChange={(value) => setValue('marina', value)} {...register("marina", { required: "Marina é obrigatória" })}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione a marina" />
                </SelectTrigger>
                <SelectContent>
                  {MARINAS.map((marina) => (
                    <SelectItem key={marina} value={marina}>
                      {marina}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.marina && <span className="text-sm text-red-500">{errors.marina.message}</span>}
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
                type="date"
                value={selectedDate ? selectedDate.toISOString().split('T')[0] : ''}
                onChange={(e) => {
                  const date = new Date(e.target.value);
                  setSelectedDate(date);
                  const formattedDate = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
                  setValue('dataAdmissao', formattedDate);
                }}
                className="text-sm"
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
              <Label>EPIs</Label>
              <Select
                onValueChange={(value) => {
                  const epi = epis.find(e => e.id === parseInt(value));
                  if (epi) {
                    toggleEPI(epi);
                  }
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Selecione os EPIs" />
                </SelectTrigger>
                <SelectContent>
                  {episDisponiveis.map((epi) => (
                    <SelectItem 
                      key={epi.id} 
                      value={epi.id.toString()}
                    >
                      {epi.nome} {epi.quantidade < 10 && `(Estoque: ${epi.quantidade})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedEPIs.length > 0 && (
                <div className="mt-2">
                  <div className="flex flex-wrap gap-2">
                    {selectedEPIs.map((epi) => (
                      <Badge 
                        key={epi.epiId}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {epi.nome}
                        <button
                          type="button"
                          onClick={() => toggleEPI({ id: epi.epiId, nome: epi.nome, ca: epi.ca, validade: epi.validade })}
                          className="ml-1 hover:text-red-500"
                        >
                          <X size={14} />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
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
