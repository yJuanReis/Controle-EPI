import React, { useEffect, useState } from 'react';
import { useEPI } from '../contexts/EPIContext';
import { Button } from '../components/ui/button';
import { Plus, ArrowUpDown, Pencil, Trash } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '../components/ui/table';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { Badge } from '../components/ui/badge';
import AdicionarEPIModal from '../components/AdicionarEPIModal';

interface EPI {
  id: number;
  nome: string;
  valorUn: number;
  ca: string;
  quantidade: number;
  fornecedor: string;
  validade: string;
  status?: string;
  valor: number;
}

interface EPIPerdido {
  id: string;
  epiNome: string;
  epiCA: string;
  colaboradorNome: string;
  dataPerca: string;
  observacoes: string;
}

const EPIs = () => {
  const { epis, episDevolvidos, episPerdidos } = useEPI();
  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  
  const [ordenacao, setOrdenacao] = useState<{
    campo: keyof EPI | '';
    direcao: 'asc' | 'desc';
  }>({
    campo: '',
    direcao: 'asc'
  });

  const [ordenacaoPerdidos, setOrdenacaoPerdidos] = useState<{
    campo: keyof EPIPerdido | '';
    direcao: 'asc' | 'desc';
  }>({
    campo: '',
    direcao: 'asc'
  });

  const ordenarEPIs = (epis: EPI[]) => {
    if (!ordenacao.campo || !epis) return epis || [];

    return [...epis].sort((a, b) => {
      const valorA = a[ordenacao.campo];
      const valorB = b[ordenacao.campo];

      // Tratamento especial para valores numéricos
      if (typeof valorA === 'number' && typeof valorB === 'number') {
        return ordenacao.direcao === 'asc' ? valorA - valorB : valorB - valorA;
      }

      // Tratamento para strings
      const strA = String(valorA || '').toLowerCase();
      const strB = String(valorB || '').toLowerCase();

      if (strA < strB) return ordenacao.direcao === 'asc' ? -1 : 1;
      if (strA > strB) return ordenacao.direcao === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const alternarOrdenacao = (campo: keyof EPI) => {
    setOrdenacao(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  const ordenarEPIsPerdidos = (epis: EPIPerdido[]) => {
    if (!ordenacaoPerdidos.campo || !epis) return epis || [];

    return [...epis].sort((a, b) => {
      const valorA = a[ordenacaoPerdidos.campo];
      const valorB = b[ordenacaoPerdidos.campo];

      // Tratamento para strings
      const strA = String(valorA || '').toLowerCase();
      const strB = String(valorB || '').toLowerCase();

      if (strA < strB) return ordenacaoPerdidos.direcao === 'asc' ? -1 : 1;
      if (strA > strB) return ordenacaoPerdidos.direcao === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const alternarOrdenacaoPerdidos = (campo: keyof EPIPerdido) => {
    setOrdenacaoPerdidos(prev => ({
      campo,
      direcao: prev.campo === campo && prev.direcao === 'asc' ? 'desc' : 'asc'
    }));
  };

  const episOrdenados = ordenarEPIs(epis || []);
  const episPerdidosOrdenados = ordenarEPIsPerdidos(episPerdidos || []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 p-6 font-sans">
      <Header />
      <Navigation />
      
      <div className="space-y-8">
        {/* Lista principal de EPIs */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-blue-100">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">EPIs</h1>
            <Button 
              onClick={() => setModalAdicionarAberto(true)} 
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-lg px-6 py-3"
            >
              <Plus size={24} />
              Adicionar EPI
            </Button>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 border-b-2 border-gray-200">
                  <TableHead 
                    className="text-lg font-bold text-gray-800 py-4 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacao('nome')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Nome
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacao('valorUn')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Valor UN
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacao('ca')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      CA
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacao('quantidade')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Quantidade
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacao('valor')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Valor Total
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacao('fornecedor')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Fornecedor
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacao('validade')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Validade
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacao('status')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Status
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead className="text-lg font-bold text-gray-800 text-center">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {episOrdenados && episOrdenados.length > 0 ? (
                  episOrdenados.map((epi, index) => (
                    <TableRow 
                      key={epi.id}
                      className={`text-base ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}
                    >
                      <TableCell className="text-center">
                        <div className="font-bold text-lg text-gray-900">{epi.nome}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold text-base text-gray-900">R$ {epi.valorUn?.toFixed(2) || '0.00'}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold text-base text-gray-900">{epi.ca}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold text-base text-gray-900">{epi.quantidade}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold text-base text-gray-900">R$ {epi.valor?.toFixed(2) || '0.00'}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold text-base text-gray-900">{epi.fornecedor}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold text-base text-gray-900">{epi.validade}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <span className={`px-3 py-1 rounded-full text-base font-semibold
                          ${epi.status === 'Ativo' ? 'bg-green-100 text-green-800' :
                            epi.status === 'Vencido' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'}`}>
                          {epi.status}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex justify-center items-center gap-2">
                          <Button 
                            variant="ghost" 
                            size="lg"
                            onClick={() => setModalAdicionarAberto(true)}
                            className="h-10 w-10 p-0 hover:bg-blue-100"
                          >
                            <Pencil size={20} className="text-gray-600" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">
                      <div className="text-lg text-gray-500">Nenhum EPI cadastrado</div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Lista de EPIs Perdidos */}
        <div className="bg-white rounded-xl shadow-lg p-8 border border-red-100">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">EPIs Perdidos</h2>
            <p className="text-lg text-gray-600">EPIs registrados como perdidos por colaboradores</p>
          </div>
          
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100 border-b-2 border-gray-200">
                  <TableHead 
                    className="text-lg font-bold text-gray-800 py-4 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacaoPerdidos('epiNome')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      EPI
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacaoPerdidos('epiCA')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      CA
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacaoPerdidos('colaboradorNome')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Colaborador
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacaoPerdidos('dataPerca')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Data da Perda
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                  <TableHead 
                    className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                    onClick={() => alternarOrdenacaoPerdidos('observacoes')}
                  >
                    <div className="flex items-center justify-center gap-2">
                      Observações
                      <ArrowUpDown size={16} />
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {episPerdidosOrdenados && episPerdidosOrdenados.length > 0 ? (
                  episPerdidosOrdenados.map((epi, index) => (
                    <TableRow 
                      key={epi.id}
                      className={`text-base ${index % 2 === 0 ? 'bg-white' : 'bg-red-50'} hover:bg-red-100 transition-colors`}
                    >
                      <TableCell className="text-center">
                        <div className="font-bold text-lg text-gray-900">{epi.epiNome}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold text-base text-gray-900">{epi.epiCA}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold text-base text-gray-900">{epi.colaboradorNome}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold text-base text-gray-900">{epi.dataPerca}</div>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="font-semibold text-base text-gray-900">{epi.observacoes}</div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-8">
                      <div className="text-lg text-gray-500">Nenhum EPI registrado como perdido</div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {modalAdicionarAberto && (
        <AdicionarEPIModal
          isOpen={modalAdicionarAberto}
          onClose={() => setModalAdicionarAberto(false)}
        />
      )}
    </div>
  );
};

export default EPIs; 