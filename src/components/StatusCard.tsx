
import React from 'react';
import { useEPI } from '../contexts/EPIContext';

const StatusCard = () => {
  const { epis } = useEPI();
  
  // Get current date in pt-BR format
  const currentDate = new Date().toLocaleDateString('pt-BR');
  
  // Calculate counts for each status
  const ativos = epis.filter(epi => epi.status === 'Ativo').length;
  const proximosVencimento = epis.filter(epi => epi.status === 'Próximo ao vencimento').length;
  const vencidos = epis.filter(epi => epi.status === 'Vencido').length;
  
  // Count low stock items (less than 10)
  const baixoEstoque = epis.filter(epi => epi.quantidade < 10).length;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Status dos EPIs</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">Ativos</span>
          </div>
          <span className="font-semibold">{ativos}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-sm">Baixo Estoque</span>
          </div>
          <span className="font-semibold">{baixoEstoque}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm">Próximos ao Vencimento</span>
          </div>
          <span className="font-semibold">{proximosVencimento}</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
            <span className="text-sm">Vencidos</span>
          </div>
          <span className="font-semibold">{vencidos}</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-500">Atualizado em: {currentDate}</p>
      </div>
    </div>
  );
};

export default StatusCard;
