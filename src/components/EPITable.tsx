
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import { Plus, Search, FilterX } from 'lucide-react';

const EPITable = () => {
  const navigate = useNavigate();
  
  const handleNovoEPI = () => {
    navigate('/estoque');
  };

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
              placeholder="Buscar EPIs por nome, CA, fornecedor..."
              className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="flex items-center space-x-2">
            <select className="py-2 px-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">
              <option>Todos os Status</option>
              <option>Ativos</option>
              <option>Próximos ao Vencimento</option>
              <option>Vencidos</option>
            </select>
            <Button variant="ghost" size="icon" className="rounded-full h-10 w-10">
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
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3"></div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Capacete de Segurança
                    </div>
                    <div className="text-sm text-gray-500">Tipo II, Classe B</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">12345</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                15/12/2023
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                3M Brasil
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  Próximo ao vencimento
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button className="rounded-full h-8 w-8 bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-blue-600">
                      edit
                    </span>
                  </button>
                  <button className="rounded-full h-8 w-8 bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-red-600">
                      delete
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="material-symbols-outlined text-green-600">
                      back_hand
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Luvas de Proteção
                    </div>
                    <div className="text-sm text-gray-500">Resistente a cortes</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">23456</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                20/06/2024
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                Ansell Healthcare
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Ativo
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button className="rounded-full h-8 w-8 bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-blue-600">
                      edit
                    </span>
                  </button>
                  <button className="rounded-full h-8 w-8 bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-red-600">
                      delete
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="material-symbols-outlined text-purple-600">
                      visibility
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Óculos de Proteção
                    </div>
                    <div className="text-sm text-gray-500">Lente incolor, UV</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">34567</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                10/03/2023
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                MSA Safety
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                  Vencido
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button className="rounded-full h-8 w-8 bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-blue-600">
                      edit
                    </span>
                  </button>
                  <button className="rounded-full h-8 w-8 bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-red-600">
                      delete
                    </span>
                  </button>
                </div>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-amber-100 flex items-center justify-center mr-3">
                    <span className="material-symbols-outlined text-amber-600">
                      health_and_safety
                    </span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">
                      Respirador Semi-facial
                    </div>
                    <div className="text-sm text-gray-500">PFF2 / N95</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">45678</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                05/09/2024
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                3M Brasil
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Ativo
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end space-x-2">
                  <button className="rounded-full h-8 w-8 bg-blue-50 hover:bg-blue-100 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-blue-600">
                      edit
                    </span>
                  </button>
                  <button className="rounded-full h-8 w-8 bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors">
                    <span className="material-symbols-outlined text-red-600">
                      delete
                    </span>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-between items-center">
        <p className="text-sm text-gray-500">Mostrando 4 de 24 EPIs</p>
        <div className="flex space-x-2">
          <button className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
            Anterior
          </button>
          <button className="px-3 py-1 rounded-md bg-primary-50 text-primary-600 font-medium border border-primary-200">
            1
          </button>
          <button className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
            2
          </button>
          <button className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
            3
          </button>
          <button className="px-3 py-1 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors">
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
};

export default EPITable;
