import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Package, Pencil, ArrowUpDown } from 'lucide-react';
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
  const [ordem, setOrdem] = useState<'asc' | 'desc'>('asc');

  // Verifica e atualiza o status dos EPIs com base na data de validade
  useEffect(() => {
    const atualizarStatusEPIs = () => {
      const hoje = new Date();
      const trintaDiasDepois = new Date();
      trintaDiasDepois.setDate(hoje.getDate() + 30);

      const episAtualizados = epis.map(epi => {
        // Converter a data de validade para objeto Date
        const partesData = epi.validade.split('/');
        let dataValidade;
        
        if (partesData.length === 3) {
          // Formato DD/MM/AAAA
          dataValidade = new Date(
            parseInt(partesData[2]), 
            parseInt(partesData[1]) - 1, 
            parseInt(partesData[0])
          );
        } else {
          // Tenta converter de AAAA-MM-DD (formato de input date)
          dataValidade = new Date(epi.validade);
        }
        
        // Determinar o status com base na data
        let novoStatus = epi.status;
        
        if (dataValidade < hoje) {
          novoStatus = 'Vencido';
        } else if (dataValidade <= trintaDiasDepois) {
          novoStatus = 'Próximo ao vencimento';
        } else {
          novoStatus = 'Ativo';
        }
        
        // Retornar EPI atualizado apenas se houve mudança no status
        if (novoStatus !== epi.status) {
          return { ...epi, status: novoStatus };
        }
        
        return epi;
      });
      
      // Atualizar o estado apenas se houver alterações
      if (JSON.stringify(episAtualizados) !== JSON.stringify(epis)) {
        setEpis(episAtualizados);
      }
    };
    
    // Executa ao carregar o componente
    atualizarStatusEPIs();
    
    // Configura um intervalo para verificar o status periodicamente (a cada 12 horas)
    const intervalo = setInterval(atualizarStatusEPIs, 12 * 60 * 60 * 1000);
    
    // Limpa o intervalo quando o componente é desmontado
    return () => clearInterval(intervalo);
  }, [epis, setEpis]);

  const adicionarItem = (novoItem: Omit<EPI, 'id'>) => {
    // Determinar o status do novo item baseado na validade
    const hoje = new Date();
    const trintaDiasDepois = new Date();
    trintaDiasDepois.setDate(hoje.getDate() + 30);
    
    // Converter a data de validade para objeto Date
    const dataValidade = new Date(novoItem.validade);
    
    let status = 'Ativo';
    if (dataValidade < hoje) {
      status = 'Vencido';
    } else if (dataValidade <= trintaDiasDepois) {
      status = 'Próximo ao vencimento';
    }
    
    // Adicionar o item com o status correto
    addEPI({ ...novoItem, status });
    setModalAdicionarAberto(false);
  };

  const editarItem = (itemEditado: EPI) => {
    // Atualizar o status do item editado com base na validade
    const hoje = new Date();
    const trintaDiasDepois = new Date();
    trintaDiasDepois.setDate(hoje.getDate() + 30);
    
    // Converter a data de validade para objeto Date
    let dataValidade;
    if (itemEditado.validade.includes('/')) {
      // Formato DD/MM/AAAA
      const partesData = itemEditado.validade.split('/');
      dataValidade = new Date(
        parseInt(partesData[2]), 
        parseInt(partesData[1]) - 1, 
        parseInt(partesData[0])
      );
    } else {
      // Formato AAAA-MM-DD
      dataValidade = new Date(itemEditado.validade);
    }
    
    let status = 'Ativo';
    if (dataValidade < hoje) {
      status = 'Vencido';
    } else if (dataValidade <= trintaDiasDepois) {
      status = 'Próximo ao vencimento';
    }
    
    // Atualizar o item com o status correto
    updateEPI({ ...itemEditado, status });
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

  // Função para obter a classe de estilo com base no status
  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'Vencido':
        return "text-red-600";
      case 'Próximo ao vencimento':
        return "text-amber-600";
      case 'Ativo':
        return "text-green-600";
      default:
        return "";
    }
  };

  const alternarOrdenacao = (campo: keyof EPI) => {
    const sortedItems = [...itensFiltrados].sort((a, b) => {
      if (ordem === 'asc') {
        return a[campo] < b[campo] ? -1 : 1;
      } else {
        return b[campo] < a[campo] ? -1 : 1;
      }
    });
    setEpis(sortedItems);
    setOrdem(ordem === 'asc' ? 'desc' : 'asc');
  };

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
              <TableRow className="bg-gray-100 border-b-2 border-gray-200">
                <TableHead 
                  className="text-lg font-bold text-gray-800 py-4 text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => alternarOrdenacao('nome')}
                >
                  <div className="flex items-center justify-center gap-2">
                    EPI
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
                <TableHead 
                  className="text-lg font-bold text-gray-800 text-center cursor-pointer hover:bg-gray-200"
                  onClick={() => alternarOrdenacao('valorUn')}
                >
                  <div className="flex items-center justify-center gap-2">
                    Valor UN
                    <ArrowUpDown size={16} />
                  </div>
                </TableHead>
                <TableHead className="text-lg font-bold text-gray-800 text-center">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {itensFiltrados.map((item, index) => (
                <TableRow 
                  key={item.id} 
                  className={`text-base ${index % 2 === 0 ? 'bg-white' : 'bg-blue-50'} hover:bg-blue-100 transition-colors`}
                >
                  <TableCell className="text-center">
                    <div className="font-bold text-lg text-gray-900">{item.nome}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold text-base text-gray-900">{item.ca}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className={`font-semibold text-base ${item.quantidade < 10 ? 'text-red-600' : 'text-gray-900'}`}>
                      {item.quantidade}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold text-base text-gray-900">{item.validade}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-3 py-1 rounded-full text-base font-semibold ${getStatusClass(item.status)}`}>
                      {item.status || 'Ativo'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-semibold text-base text-gray-900">R$ {item.valorUn.toFixed(2)}</div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Button 
                        variant="ghost" 
                        size="lg"
                        onClick={() => abrirModalEditar(item)}
                        className="h-10 w-10 p-0 hover:bg-blue-100"
                      >
                        <Pencil size={20} className="text-gray-600" />
                      </Button>
                    </div>
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
