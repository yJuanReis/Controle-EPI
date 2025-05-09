
import React from 'react';

const DistributionCard = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">
        Distribuição de EPIs por Colaborador
      </h3>
      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Carlos Silva</span>
            <span className="text-sm font-semibold">5 EPIs</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full" style={{width: "85%"}}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Ana Almeida</span>
            <span className="text-sm font-semibold">4 EPIs</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full" style={{width: "72%"}}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Marcos Oliveira</span>
            <span className="text-sm font-semibold">3 EPIs</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full" style={{width: "64%"}}></div>
          </div>
        </div>
        <div>
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm">Pedro Santos</span>
            <span className="text-sm font-semibold">2 EPIs</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary-500 h-2 rounded-full" style={{width: "45%"}}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DistributionCard;
