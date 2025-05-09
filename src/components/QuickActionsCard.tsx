
import React from 'react';

const QuickActionsCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Ações Rápidas</h3>
      <div className="space-y-3">
        <button className="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center justify-between transition-colors">
          <span className="flex items-center">
            <span className="material-symbols-outlined mr-2">summarize</span>
            Relatório de Entregas
          </span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <button className="w-full py-2 px-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center justify-between transition-colors">
          <span className="flex items-center">
            <span className="material-symbols-outlined mr-2">swap_horiz</span>
            Atribuir EPI a Colaborador
          </span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <button className="w-full py-2 px-4 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 flex items-center justify-between transition-colors">
          <span className="flex items-center">
            <span className="material-symbols-outlined mr-2">person_add</span>
            Cadastrar Colaborador
          </span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
        <button className="w-full py-2 px-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex items-center justify-between transition-colors">
          <span className="flex items-center">
            <span className="material-symbols-outlined mr-2">inventory</span>
            Gerenciar Estoque de EPIs
          </span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      </div>
    </div>
  );
};

export default QuickActionsCard;
