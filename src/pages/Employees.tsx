
import React from 'react';
import { employees, ppeCatalog } from '@/data/mockData';
import { DataTable } from '@/components/UI/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const Employees = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Colaboradores</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciamento de colaboradores e seus equipamentos de proteção
          </p>
        </div>
        <Button className="bg-safety-blue hover:bg-safety-blue-dark">
          <Plus className="mr-2 h-4 w-4" /> Novo Colaborador
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Colaboradores</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={employees}
            columns={[
              { 
                key: 'name', 
                header: 'Nome',
                render: (item) => (
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback className="bg-safety-blue-light text-safety-blue-dark">
                        {item.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span>{item.name}</span>
                  </div>
                )
              },
              { 
                key: 'position', 
                header: 'Cargo',
              },
              { 
                key: 'department', 
                header: 'Departamento',
              },
              { 
                key: 'requiredPPE', 
                header: 'EPIs Necessários',
                render: (item) => (
                  <div className="flex flex-wrap gap-1">
                    {item.requiredPPE.map((ppeId, index) => {
                      const ppe = ppeCatalog.find(p => p.id === ppeId);
                      return (
                        <Badge key={index} variant="outline" className="bg-safety-blue/10">
                          {ppe?.type || ppeId}
                        </Badge>
                      );
                    })}
                  </div>
                )
              },
              { 
                key: 'status', 
                header: 'Status',
                render: (item) => {
                  // Determine if employee has all required PPE assigned
                  const hasAllPPE = item.requiredPPE.length === item.assignedPPE.length;
                  return (
                    <Badge className={hasAllPPE ? 'bg-safety-green' : 'bg-safety-orange'}>
                      {hasAllPPE ? 'Completo' : 'Pendente'}
                    </Badge>
                  );
                }
              },
              { 
                key: 'actions', 
                header: 'Ações',
                render: () => (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Detalhes</Button>
                    <Button variant="outline" size="sm">Entregar EPI</Button>
                  </div>
                )
              }
            ]}
            searchable={true}
            searchKeys={['name', 'position', 'department']}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Employees;
