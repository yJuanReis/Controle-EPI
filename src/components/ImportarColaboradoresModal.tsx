import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Upload, FileText, AlertCircle, CheckCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ImportarColaboradoresModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (colaboradores: any[]) => void;
}

interface ColaboradorImportado {
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  status: 'ativo' | 'afastado' | 'férias' | 'baixado';
  marina: string;
  linha: number;
  erros: string[];
}

const ImportarColaboradoresModal = ({ isOpen, onClose, onImport }: ImportarColaboradoresModalProps) => {
  const [dados, setDados] = useState<ColaboradorImportado[]>([]);
  const [erro, setErro] = useState<string>('');
  const [sucesso, setSucesso] = useState<string>('');

  const validarStatus = (status: string): boolean => {
    const statusValidos = ['ativo', 'afastado', 'férias', 'baixado'];
    return statusValidos.includes(status.toLowerCase());
  };

  const validarData = (data: string): boolean => {
    const regex = /^\d{2}\/\d{2}\/\d{4}$/;
    return regex.test(data);
  };

  const processarArquivo = (arquivo: File) => {
    const leitor = new FileReader();
    leitor.onload = (evento) => {
      try {
        const dados = new Uint8Array(evento.target?.result as ArrayBuffer);
        const workbook = XLSX.read(dados, { type: 'array' });
        const primeiraPlanilha = workbook.Sheets[workbook.SheetNames[0]];
        const dadosBrutos: any[] = XLSX.utils.sheet_to_json(primeiraPlanilha, { header: 1 });

        if (dadosBrutos.length < 2) {
          setErro('O arquivo está vazio ou não contém dados válidos');
          return;
        }

        const cabecalho = dadosBrutos[0];
        const colunasEsperadas = ['nome', 'cargo', 'departamento', 'dataAdmissao', 'status', 'marina'];
        
        const cabecalhoValido = colunasEsperadas.every(coluna => 
          cabecalho.map((c: string) => c.toLowerCase()).includes(coluna.toLowerCase())
        );

        if (!cabecalhoValido) {
          setErro('O cabeçalho do arquivo não contém todas as colunas necessárias');
          return;
        }

        const colaboradoresProcessados: ColaboradorImportado[] = dadosBrutos
          .slice(1)
          .map((linha: any[], index: number) => {
            const colaborador: ColaboradorImportado = {
              nome: linha[cabecalho.indexOf('nome')] || '',
              cargo: linha[cabecalho.indexOf('cargo')] || '',
              departamento: linha[cabecalho.indexOf('departamento')] || '',
              dataAdmissao: linha[cabecalho.indexOf('dataAdmissao')] || '',
              status: linha[cabecalho.indexOf('status')]?.toLowerCase() || '',
              marina: linha[cabecalho.indexOf('marina')] || '',
              linha: index + 2,
              erros: []
            };

            // Validações
            if (!colaborador.nome) colaborador.erros.push('Nome é obrigatório');
            if (!colaborador.cargo) colaborador.erros.push('Cargo é obrigatório');
            if (!colaborador.departamento) colaborador.erros.push('Departamento é obrigatório');
            if (!validarData(colaborador.dataAdmissao)) colaborador.erros.push('Data de admissão inválida');
            if (!validarStatus(colaborador.status)) colaborador.erros.push('Status inválido');
            if (!colaborador.marina) colaborador.erros.push('Marina é obrigatória');

            return colaborador;
          });

        setDados(colaboradoresProcessados);
        setErro('');
        setSucesso('Arquivo processado com sucesso! Verifique os dados antes de importar.');
      } catch (erro) {
        setErro('Erro ao processar o arquivo. Verifique se o formato está correto.');
      }
    };

    leitor.readAsArrayBuffer(arquivo);
  };

  const handleImportar = () => {
    const colaboradoresValidos = dados.filter(c => c.erros.length === 0);
    if (colaboradoresValidos.length === 0) {
      setErro('Não há dados válidos para importar');
      return;
    }

    onImport(colaboradoresValidos);
    setSucesso('Colaboradores importados com sucesso!');
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Importar Colaboradores</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-center w-full">
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                <Upload className="w-8 h-8 mb-2 text-gray-500" />
                <p className="mb-2 text-sm text-gray-500">
                  Clique para selecionar ou arraste o arquivo
                </p>
                <p className="text-xs text-gray-500">
                  XLSX, XLS ou CSV
                </p>
              </div>
              <input
                type="file"
                className="hidden"
                accept=".xlsx,.xls,.csv"
                onChange={(e) => e.target.files?.[0] && processarArquivo(e.target.files[0])}
              />
            </label>
          </div>

          {erro && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{erro}</AlertDescription>
            </Alert>
          )}

          {sucesso && (
            <Alert className="bg-green-50 text-green-800 border-green-200">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{sucesso}</AlertDescription>
            </Alert>
          )}

          {dados.length > 0 && (
            <>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Linha</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Cargo</TableHead>
                      <TableHead>Departamento</TableHead>
                      <TableHead>Data Admissão</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Marina</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {dados.map((colaborador, index) => (
                      <TableRow key={index} className={colaborador.erros.length > 0 ? 'bg-red-50' : ''}>
                        <TableCell>{colaborador.linha}</TableCell>
                        <TableCell>{colaborador.nome}</TableCell>
                        <TableCell>{colaborador.cargo}</TableCell>
                        <TableCell>{colaborador.departamento}</TableCell>
                        <TableCell>{colaborador.dataAdmissao}</TableCell>
                        <TableCell>{colaborador.status}</TableCell>
                        <TableCell>{colaborador.marina}</TableCell>
                        <TableCell>
                          {colaborador.erros.length > 0 ? (
                            <div className="text-red-500 text-sm">
                              {colaborador.erros.join(', ')}
                            </div>
                          ) : (
                            <CheckCircle className="text-green-500 h-4 w-4" />
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleImportar}
                  disabled={dados.every(c => c.erros.length > 0)}
                >
                  Importar Colaboradores
                </Button>
              </div>
            </>
          )}

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Instruções:</h3>
            <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
              <li>O arquivo deve ser no formato XLSX, XLS ou CSV</li>
              <li>A primeira linha deve conter os cabeçalhos: nome, cargo, departamento, dataAdmissao, status, marina</li>
              <li>A data de admissão deve estar no formato DD/MM/YYYY</li>
              <li>Status deve ser um dos seguintes: ativo, afastado, férias, baixado</li>
              <li>Todos os campos são obrigatórios</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImportarColaboradoresModal; 