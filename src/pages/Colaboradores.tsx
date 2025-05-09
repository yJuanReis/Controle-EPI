
import React, { useState } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { UserPlus, Pencil } from 'lucide-react';
import AdicionarColaboradorModal from '../components/AdicionarColaboradorModal';
import EditarColaboradorModal from '../components/EditarColaboradorModal';

interface Colaborador {
  id: number;
  nome: string;
  cargo: string;
  departamento: string;
  dataAdmissao: string;
  epi: string[];
  status: 'ativo' | 'afastado' | 'férias';
}

const Colaboradores = () => {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([
    {
      id: 1,
      nome: 'Carlos Silva',
      cargo: 'Operador',
      departamento: 'Produção',
      dataAdmissao: '10/01/2020',
      epi: ['Capacete de Segurança', 'Luvas de Proteção'],
      status: 'ativo'
    },
    {
      id: 2,
      nome: 'Ana Almeida',
      cargo: 'Técnica',
      departamento: 'Laboratório',
      dataAdmissao: '15/03/2021',
      epi: ['Óculos de Proteção', 'Respirador Semi-facial'],
      status: 'ativo'
    },
    {
      id: 3,
      nome: 'Marcos Oliveira',
      cargo: 'Supervisor',
      departamento: 'Manutenção',
      dataAdmissao: '22/06/2019',
      epi: ['Capacete de Segurança', 'Luvas de Proteção', 'Óculos de Proteção'],
      status: 'férias'
    },
    {
      id: 4,
      nome: 'Pedro Santos',
      cargo: 'Auxiliar',
      departamento: 'Almoxarifado',
      dataAdmissao: '05/11/2022',
      epi: ['Luvas de Proteção', 'Respirador Semi-facial'],
      status: 'ativo'
    }
  ]);

  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [colaboradorParaEditar, setColaboradorParaEditar] = useState<Colaborador | null>(null);
  const [termoBusca, setTermoBusca] = useState('');

  const adicionarColaborador = (novoColaborador: Omit<Colaborador, 'id'>) => {
    const novoId = Math.max(0, ...colaboradores.map(c => c.id)) + 1;
    setColaboradores([...colaboradores, { ...novoColaborador, id: novoId }]);
    setModalAdicionarAberto(false);
  };

  const editarColaborador = (colaboradorEditado: Colaborador) => {
    setColaboradores(colaboradores.map(c => 
      c.id === colaboradorEditado.id ? colaboradorEditado : c
    ));
    setModalEditarAberto(false);
    setColaboradorParaEditar(null);
  };

  const abrirModalEditar = (colaborador: Colaborador) => {
    setColaboradorParaEditar(colaborador);
    setModalEditarAberto(true);
  };

  const colaboradoresFiltrados = colaboradores.filter(c => 
    c.nome.toLowerCase().includes(termoBusca.toLowerCase()) || 
    c.departamento.toLowerCase().includes(termoBusca.toLowerCase()) ||
    c.cargo.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="w-full p-6 bg-gray-50 font-sans">
      <Header />
      <Navigation />
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Colaboradores</h1>
          <Button onClick={() => setModalAdicionarAberto(true)} className="flex items-center gap-2">
            <UserPlus size={16} />
            Adicionar Colaborador
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Buscar por nome, cargo ou departamento..."
                value={termoBusca}
                onChange={(e) => setTermoBusca(e.target.value)}
                className="w-full"
              />
            </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Colaborador</TableHead>
                <TableHead>Cargo/Departamento</TableHead>
                <TableHead>Data de Admissão</TableHead>
                <TableHead>EPIs Atribuídos</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {colaboradoresFiltrados.map((colaborador) => (
                <TableRow key={colaborador.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="flex items-center">
                      <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center mr-3">
                        <span className="text-primary-600 font-medium">
                          {colaborador.nome.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="font-medium">{colaborador.nome}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{colaborador.cargo}</div>
                    <div className="text-sm text-gray-500">{colaborador.departamento}</div>
                  </TableCell>
                  <TableCell>{colaborador.dataAdmissao}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {colaborador.epi.map((e, i) => (
                        <span 
                          key={i}
                          className="inline-block bg-primary-50 text-primary-700 text-xs px-2 py-1 rounded-full"
                        >
                          {e}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      colaborador.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : colaborador.status === 'férias'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {colaborador.status.charAt(0).toUpperCase() + colaborador.status.slice(1)}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => abrirModalEditar(colaborador)}
                      className="h-8 w-8 p-0"
                    >
                      <Pencil size={16} />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {modalAdicionarAberto && (
        <AdicionarColaboradorModal 
          isOpen={modalAdicionarAberto}
          onClose={() => setModalAdicionarAberto(false)}
          onAdicionar={adicionarColaborador}
        />
      )}

      {modalEditarAberto && colaboradorParaEditar && (
        <EditarColaboradorModal 
          isOpen={modalEditarAberto}
          onClose={() => setModalEditarAberto(false)}
          onSalvar={editarColaborador}
          colaborador={colaboradorParaEditar}
        />
      )}
    </div>
  );
};

export default Colaboradores;
