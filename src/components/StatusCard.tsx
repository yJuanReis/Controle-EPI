
import React from 'react';

const StatusCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Status dos EPIs</h3>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
            <span className="text-sm">Ativos</span>
          </div>
          <span className="font-semibold">18</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-sm">Baixo Estoque</span>
          </div>
          <span className="font-semibold">3</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-sm">Próximos ao Vencimento</span>
          </div>
          <span className="font-semibold">2</span>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-500 mr-2"></div>
            <span className="text-sm">Vencidos</span>
          </div>
          <span className="font-semibold">1</span>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t">
        <p className="text-sm text-gray-500">Atualizado em: 10/02/2023</p>
      </div>
    </div>
  );
};

export default StatusCard;
