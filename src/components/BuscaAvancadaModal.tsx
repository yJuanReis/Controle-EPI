import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { useEPI } from '@/contexts/EPIContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

interface BuscaAvancadaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSearch: (colaborador: any) => void;
}

const BuscaAvancadaModal = ({ isOpen, onClose, onSearch }: BuscaAvancadaModalProps) => {
  const { epis } = useEPI();
  const [nome, setNome] = useState('');
  const [cargo, setCargo] = useState('');
  const [departamento, setDepartamento] = useState('');
  const [dataAdmissaoInicial, setDataAdmissaoInicial] = useState<Date>();
  const [dataAdmissaoFinal, setDataAdmissaoFinal] = useState<Date>();
  const [episSelecionados, setEpisSelecionados] = useState<number[]>([]);
  const [status, setStatus] = useState<string>('');

  const realizarBusca = () => {
    const colaboradoresStorage = localStorage.getItem('colaboradores');
    if (!colaboradoresStorage) return;

    const todosColaboradores = JSON.parse(colaboradoresStorage);
    const { episAtribuidos } = useEPI();

    let resultados = todosColaboradores.filter((colaborador: any) => {
      // Filtro por nome
      if (nome && !colaborador.nome.toLowerCase().includes(nome.toLowerCase())) {
        return false;
      }

      // Filtro por cargo
      if (cargo && !colaborador.cargo.toLowerCase().includes(cargo.toLowerCase())) {
        return false;
      }

      // Filtro por departamento
      if (departamento && colaborador.departamento !== departamento) {
        return false;
      }

      // Filtro por data de admissão
      if (dataAdmissaoInicial || dataAdmissaoFinal) {
        const dataAdmissao = new Date(colaborador.dataAdmissao.split('/').reverse().join('-'));
        if (dataAdmissaoInicial && dataAdmissao < dataAdmissaoInicial) return false;
        if (dataAdmissaoFinal && dataAdmissao > dataAdmissaoFinal) return false;
      }

      // Filtro por status
      if (status && colaborador.status !== status) {
        return false;
      }

      // Filtro por EPIs atribuídos
      if (episSelecionados.length > 0) {
        const episDoColaborador = episAtribuidos.filter(
          (epi: any) => epi.colaboradorId === colaborador.id
        );
        const temTodosEPIs = episSelecionados.every(epiId =>
          episDoColaborador.some((epi: any) => epi.epiId === epiId)
        );
        if (!temTodosEPIs) return false;
      }

      return true;
    });

    if (resultados.length > 0) {
      onSearch(resultados[0]); // Retorna o primeiro resultado encontrado
    }
    onClose();
  };

  const limparFiltros = () => {
    setNome('');
    setCargo('');
    setDepartamento('');
    setDataAdmissaoInicial(undefined);
    setDataAdmissaoFinal(undefined);
    setEpisSelecionados([]);
    setStatus('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Busca Avançada</DialogTitle>
          <DialogDescription>
            Preencha os campos desejados para encontrar um colaborador específico
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                placeholder="Nome do colaborador"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cargo">Cargo</Label>
              <Input
                id="cargo"
                placeholder="Cargo do colaborador"
                value={cargo}
                onChange={(e) => setCargo(e.target.value)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Departamento</Label>
              <Select value={departamento} onValueChange={setDepartamento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o departamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Produção">Produção</SelectItem>
                  <SelectItem value="Manutenção">Manutenção</SelectItem>
                  <SelectItem value="Laboratório">Laboratório</SelectItem>
                  <SelectItem value="Almoxarifado">Almoxarifado</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ativo">Ativo</SelectItem>
                  <SelectItem value="férias">Férias</SelectItem>
                  <SelectItem value="afastado">Afastado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Admissão Inicial</Label>
              <DatePicker
                date={dataAdmissaoInicial}
                setDate={setDataAdmissaoInicial}
                placeholder="Data inicial"
              />
            </div>
            <div className="space-y-2">
              <Label>Data de Admissão Final</Label>
              <DatePicker
                date={dataAdmissaoFinal}
                setDate={setDataAdmissaoFinal}
                placeholder="Data final"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>EPIs Atribuídos</Label>
            <div className="grid grid-cols-2 gap-2 border rounded-md p-2">
              {epis.map((epi) => (
                <div key={epi.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`epi-${epi.id}`}
                    checked={episSelecionados.includes(epi.id)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setEpisSelecionados([...episSelecionados, epi.id]);
                      } else {
                        setEpisSelecionados(episSelecionados.filter(id => id !== epi.id));
                      }
                    }}
                  />
                  <Label htmlFor={`epi-${epi.id}`}>{epi.nome}</Label>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-between">
          <Button variant="outline" onClick={limparFiltros}>
            Limpar Filtros
          </Button>
          <div className="space-x-2">
            <Button variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button onClick={realizarBusca}>
              Buscar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BuscaAvancadaModal; 