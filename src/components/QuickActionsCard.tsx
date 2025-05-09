
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronRight, FileText, Users, RefreshCw, Package } from 'lucide-react';

const QuickActionsCard = () => {
  const navigate = useNavigate();
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-semibold mb-4 text-gray-800">Ações Rápidas</h3>
      <div className="space-y-3">
        <Button 
          variant="outline"
          className="w-full py-2 px-4 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 flex items-center justify-between transition-colors"
          onClick={() => navigate('/')}
        >
          <span className="flex items-center">
            <FileText className="mr-2" size={18} />
            Relatório de Entregas
          </span>
          <ChevronRight size={18} />
        </Button>
        
        <Button 
          variant="outline"
          className="w-full py-2 px-4 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 flex items-center justify-between transition-colors"
          onClick={() => navigate('/')}
        >
          <span className="flex items-center">
            <RefreshCw className="mr-2" size={18} />
            Atribuir EPI a Colaborador
          </span>
          <ChevronRight size={18} />
        </Button>
        
        <Button 
          variant="outline"
          className="w-full py-2 px-4 bg-amber-50 text-amber-700 rounded-lg hover:bg-amber-100 flex items-center justify-between transition-colors"
          onClick={() => navigate('/colaboradores')}
        >
          <span className="flex items-center">
            <Users className="mr-2" size={18} />
            Cadastrar Colaborador
          </span>
          <ChevronRight size={18} />
        </Button>
        
        <Button 
          variant="outline"
          className="w-full py-2 px-4 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 flex items-center justify-between transition-colors"
          onClick={() => navigate('/estoque')}
        >
          <span className="flex items-center">
            <Package className="mr-2" size={18} />
            Gerenciar Estoque de EPIs
          </span>
          <ChevronRight size={18} />
        </Button>
      </div>
    </div>
  );
};

export default QuickActionsCard;
