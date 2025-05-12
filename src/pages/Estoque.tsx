
import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Package, Pencil } from 'lucide-react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import AdicionarEstoqueModal from '../components/AdicionarEstoqueModal';
import EditarEstoqueModal from '../components/EditarEstoqueModal';
import { useEPI, EPI } from '../contexts/EPIContext';

const Estoque = () => {
  const { epis, setEpis, addEPI, updateEPI } = useEPI();
  
  const [modalAdicionarAberto, setModalAdicionarAberto] = useState(false);
  const [modalEditarAberto, setModalEditarAberto] = useState(false);
  const [itemParaEditar, setItemParaEditar] = useState<EPI | null>(null);
  const [termoBusca, setTermoBusca] = useState('');

  const adicionarItem = (novoItem: Omit<EPI, 'id'>) => {
    addEPI(novoItem);
    setModalAdicionarAberto(false);
  };

  const editarItem = (itemEditado: EPI) => {
    updateEPI(itemEditado);
    setModalEditarAberto(false);
    setItemParaEditar(null);
  };

  const abrirModalEditar = (item: EPI) => {
    setItemParaEditar(item);
    setModalEditarAberto(true);
  };

  const itensFiltrados = epis.filter(item => 
    item.nome.toLowerCase().includes(termoBusca.toLowerCase()) || 
    item.ca.includes(termoBusca) ||
    item.fornecedor.toLowerCase().includes(termoBusca.toLowerCase())
  );

  return (
    <div className="w-full p-6 bg-gray-50 font-sans">
      <Header />
      <Navigation />
      
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Estoque de EPIs</h1>
          <Button onClick={() => setModalAdicionarAberto(true)} className="flex items-center gap-2">
            <Package size={16} />
            Adicionar Item
          </Button>
        </div>
        
        <div className="mb-6">
          <div className="flex gap-4">
            <div className="relative flex-grow">
              <Input
                type="text"
                placeholder="Buscar por nome, CA, fornecedor..."
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
                <TableHead>EPI</TableHead>
                <TableHead>CA</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Validade</TableHead>
                <TableHead>Fornecedor</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itensFiltrados.map((item) => (
                <TableRow key={item.id} className="hover:bg-gray-50">
                  <TableCell>
                    <div className="font-medium">{item.nome}</div>
                    <div className="text-sm text-gray-500">{item.tipo}</div>
                  </TableCell>
                  <TableCell>{item.ca}</TableCell>
                  <TableCell>
                    <span className={`font-medium ${item.quantidade < 10 ? 'text-red-600' : ''}`}>
                      {item.quantidade}
                    </span>
                  </TableCell>
                  <TableCell>{item.validade}</TableCell>
                  <TableCell>{item.fornecedor}</TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => abrirModalEditar(item)}
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
        <AdicionarEstoqueModal 
          isOpen={modalAdicionarAberto}
          onClose={() => setModalAdicionarAberto(false)}
          onAdicionar={adicionarItem}
        />
      )}

      {modalEditarAberto && itemParaEditar && (
        <EditarEstoqueModal 
          isOpen={modalEditarAberto}
          onClose={() => setModalEditarAberto(false)}
          onSalvar={editarItem}
          item={itemParaEditar}
        />
      )}
    </div>
  );
};

export default Estoque;
