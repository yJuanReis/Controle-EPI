import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Plus, Search, FilterX, Edit, Trash } from 'lucide-react';
import { useEPI } from '../contexts/EPIContext';
import { useToast } from '@/hooks/use-toast';

const EPITable = () => {
  const navigate = useNavigate();
  const { epis, setEpis } = useEPI();
  const { toast } = useToast();
  const [filtro, setFiltro] = useState<string>('Todos');
  const [termoBusca, setTermoBusca] = useState<string>('');
  
  const handleNovoEPI = () => {
    navigate('/estoque');
  };

  const handleEditEPI = (id: number) => {
    navigate(`/estoque?edit=${id}`);
  };

  const handleDeleteEPI = (id: number) => {
    if (window.confirm('Tem certeza que deseja excluir este EPI?')) {
      setEpis(epis.filter(epi => epi.id !== id));
      toast({
        title: "EPI excluído",
        description: "O EPI foi removido com sucesso.",
      });
    }
  };

  const filtrarEPIs = () => {
    let resultado = epis;
    
    // Aplicar filtro de status
    if (filtro !== 'Todos') {
      resultado = resultado.filter(epi => epi.status === filtro);
    }
    
    // Aplicar filtro de busca
    if (termoBusca) {
      resultado = resultado.filter(epi => 
        epi.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        epi.ca.includes(termoBusca) ||
        epi.fornecedor.toLowerCase().includes(termoBusca.toLowerCase())
      );
    }
    
    return resultado;
  };

  const getStatusClass = (status?: string) => {
    switch (status) {
      case 'Ativo':
        return 'bg-green-100 text-green-800';
      case 'Próximo ao vencimento':
        return 'bg-red-100 text-red-800';
      case 'Vencido':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  const limparFiltros = () => {
    setFiltro('Todos');
    setTermoBusca('');
  };

  const episFiltrados = filtrarEPIs();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-bold text-gray-800">Dashboard de EPIs</div>

        <Button 
          onClick={handleNovoEPI}
          className="bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg shadow transition-all flex items-center gap-2"
        >
          <Plus size={18} />
          Novo EPI
        </Button>
      </div>

      <div className="mb-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={termoBusca}
              onChange={(e) => setTermoBusca(e.target.value)}
              placeholder="Buscar EPIs por nome, CA, fornecedor..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select 
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="Todos">Todos os Status</option>
              <option value="Ativo">Ativos</option>
              <option value="Próximo ao vencimento">Próximos ao Vencimento</option>
              <option value="Vencido">Vencidos</option>
            </select>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={limparFiltros} 
              className="rounded-full h-10 w-10"
            >
              <FilterX size={18} />
            </Button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                EPI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor UN
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                CA
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Validade
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fornecedor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {episFiltrados.map((epi) => (
              <tr key={epi.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"></div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {epi.nome}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  R$ {epi.valorUn.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{epi.ca}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {epi.validade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {epi.fornecedor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(epi.status)}`}>
                    {epi.status || 'Ativo'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleEditEPI(epi.id)} 
                      className="rounded-full h-8 w-8 bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors"
                    >
                      <Edit className="h-4 w-4 text-blue-600" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleDeleteEPI(epi.id)}
                      className="rounded-full h-8 w-8 bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                    >
                      <Trash className="h-4 w-4 text-red-600" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {episFiltrados.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                  Nenhum EPI encontrado com os filtros atuais.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500">Mostrando {episFiltrados.length} de {epis.length} EPIs</p>
        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Anterior
          </Button>
          <Button 
            variant="outline"
            className="px-3 py-1 rounded-md bg-primary-50 text-primary-600 font-medium border border-primary-200"
          >
            1
          </Button>
          <Button 
            variant="outline"
            className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Próximo
          </Button>
        </div>
      </div>
    </div>
  );
};

export default EPITable;
