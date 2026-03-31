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
import { X, AlertTriangle, Clock, CheckCircle } from 'lucide-react';
import { useEPI, EPIAtribuido } from '../contexts/EPIContext';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: 'ativo' | 'afastado' | 'férias' | 'baixado';
  marina: string;
}

interface EPIAtribuicao {
  id: string;
  epiId: number;
  nome: string;
  status: 'ativo' | 'vencido' | 'proximo_vencimento' | 'devolvido' | 'baixado';
  dataAtribuicao: string;
}

interface EditarColaboradorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSalvar: (colaborador: Colaborador) => void;
  onExcluir: (colaboradorId: number) => void;
  colaborador: Colaborador;
}

const EditarColaboradorModal = ({ isOpen, onClose, onSalvar, onExcluir, colaborador }: EditarColaboradorModalProps) => {
  const { 
    epis, 
    episAtribuidos: episAtribuidosContext, 
    atribuirEPI, 
    getEPIsDoColaborador, 
    getEPIAtribuidoDetalhes,
    devolverEPI,
    registrarPerdaEPI,
    atualizarEPIAtribuido
  } = useEPI();
  
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
  const [episAtribuidos, setEpisAtribuidos] = useState<EPIAtribuicao[]>([]);
  const [selectedEPIs, setSelectedEPIs] = useState<number[]>([]);
  const [open, setOpen] = useState(false);
  
  useEffect(() => {
    // Carregar os EPIs atribuídos ao colaborador
    const episDoColaborador = getEPIsDoColaborador(colaborador.id);
    
    const detalhesEpisAtribuidos = episDoColaborador.map(epiAtribuido => {
      const detalhes = getEPIAtribuidoDetalhes(epiAtribuido.id);
      if (!detalhes) return null;
      
      return {
        id: epiAtribuido.id,
        epiId: detalhes.epi.id,
        nome: detalhes.epi.nome,
        status: epiAtribuido.status,
        dataAtribuicao: epiAtribuido.dataAtribuicao
      };
    }).filter((epi): epi is EPIAtribuicao => epi !== null);
    
    setEpisAtribuidos(detalhesEpisAtribuidos);
    // Inicializa os EPIs selecionados com os já atribuídos
    setSelectedEPIs(detalhesEpisAtribuidos.map(epi => epi.epiId));
  }, [colaborador.id, getEPIsDoColaborador, getEPIAtribuidoDetalhes]);
  
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
  const onStatusChange = (value: 'ativo' | 'afastado' | 'férias' | 'baixado') => {
    setValue('status', value);
  };

  const handleEPISelection = (epiId: number) => {
    setSelectedEPIs(current => {
      if (current.includes(epiId)) {
        return current.filter(id => id !== epiId);
      } else {
        return [...current, epiId];
      }
    });
  };

  const onSubmit = (data: Colaborador) => {
    // Atualiza os dados do colaborador
    onSalvar({...data, id: colaborador.id});
    
    // Remove EPIs que foram deselecionados
    episAtribuidos.forEach(epi => {
      if (!selectedEPIs.includes(epi.epiId)) {
        devolverEPI(epi.id, "EPI removido na edição do colaborador");
      }
    });

    // Adiciona novos EPIs selecionados
    selectedEPIs.forEach(epiId => {
      if (!episAtribuidos.find(epi => epi.epiId === epiId)) {
        // Adiciona com validade padrão de 1 ano
        const dataValidade = new Date();
        dataValidade.setFullYear(dataValidade.getFullYear() + 1);
        const validadeFormatada = `${dataValidade.getDate().toString().padStart(2, '0')}/${(dataValidade.getMonth() + 1).toString().padStart(2, '0')}/${dataValidade.getFullYear()}`;
        atribuirEPI(epiId, colaborador.id, validadeFormatada);
      }
    });
  };

  // Filtra EPIs disponíveis
  const episDisponiveis = epis.filter(epi => 
    epi.quantidade > 0 || episAtribuidos.some(atribuido => atribuido.epiId === epi.id)
  );
  
  // Ícone do status
  const getStatusIcon = (status: EPIAtribuido['status']) => {
    switch (status) {
      case 'vencido':
        return <AlertTriangle size={14} className="text-red-500" />;
      case 'proximo_vencimento':
        return <Clock size={14} className="text-amber-500" />;
      case 'ativo':
        return <CheckCircle size={14} className="text-green-500" />;
      default:
        return null;
    }
  };

  // Classe de estilo do status
  const getStatusClass = (status: EPIAtribuido['status']) => {
    switch (status) {
      case 'vencido':
        return "bg-red-100 text-red-800";
      case 'proximo_vencimento':
        return "bg-amber-100 text-amber-800";
      case 'ativo':
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleExcluirColaborador = () => {
    if (window.confirm(`Tem certeza que deseja excluir o colaborador ${colaborador.nome}? Esta ação não pode ser desfeita.`)) {
      // Primeiro devolver todos os EPIs atribuídos
      episAtribuidos.forEach(epi => {
        devolverEPI(epi.id, "Colaborador excluído do sistema");
      });
      
      // Então excluir o colaborador
      onExcluir(colaborador.id);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Colaborador</DialogTitle>
          <DialogDescription>
            Atualize as informações do colaborador e seus EPIs atribuídos
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
              <Label htmlFor="marina">Marina</Label>
              <Select defaultValue={colaborador.marina} onValueChange={(value) => setValue('marina', value)} {...register("marina", { required: "Marina é obrigatória" })}>
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
                  <SelectItem value="baixado">Baixado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-4">
              <Label>EPIs Atribuídos</Label>
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                  >
                    {selectedEPIs.length > 0
                      ? `${selectedEPIs.length} EPIs selecionados`
                      : "Selecionar EPIs"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Buscar EPI..." />
                    <CommandEmpty>Nenhum EPI encontrado.</CommandEmpty>
                    <CommandGroup>
                      {episDisponiveis.map((epi) => (
                        <CommandItem
                          key={epi.id}
                          onSelect={() => handleEPISelection(epi.id)}
                        >
                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={selectedEPIs.includes(epi.id)}
                              onChange={() => {}}
                              className="h-4 w-4"
                            />
                            <span>{epi.nome}</span>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>

              <div className="flex flex-wrap gap-2">
                {selectedEPIs.map(epiId => {
                  const epi = epis.find(e => e.id === epiId);
                  if (!epi) return null;
                  return (
                    <Badge
                      key={epi.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {epi.nome}
                      <button
                        type="button"
                        onClick={() => handleEPISelection(epi.id)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X size={14} />
                      </button>
                    </Badge>
                  );
                })}
              </div>
            </div>
          </div>
          
          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="destructive"
              onClick={handleExcluirColaborador}
            >
              Excluir Colaborador
            </Button>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Salvar Alterações
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditarColaboradorModal;
