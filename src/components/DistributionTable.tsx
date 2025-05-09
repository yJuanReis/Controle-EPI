
import React from 'react';

const DistributionTable = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <div className="text-2xl font-bold mb-6 text-gray-800">Distribuição de EPIs por Colaborador</div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Colaborador
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                EPI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Atribuição
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Validade do EPI
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-600 font-medium">CS</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Carlos Silva</div>
                    <div className="text-sm text-gray-500">Operador, Produção</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium">Capacete de Segurança</div>
                <div className="text-sm text-gray-500">CA: 12345</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">08/02/2023</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">15/12/2023</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Em uso
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3">Detalhes</button>
                <button className="text-amber-600 hover:text-amber-900">Devolução</button>
              </td>
            </tr>
            <tr className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <span className="text-purple-600 font-medium">AA</span>
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">Ana Almeida</div>
                    <div className="text-sm text-gray-500">Técnica, Laboratório</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium">Luvas de Proteção</div>
                <div className="text-sm text-gray-500">CA: 23456</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">07/02/2023</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">20/06/2024</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  Em uso
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button className="text-blue-600 hover:text-blue-900 mr-3">Detalhes</button>
                <button className="text-amber-600 hover:text-amber-900">Devolução</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DistributionTable;
