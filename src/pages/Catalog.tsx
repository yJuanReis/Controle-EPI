
import React from 'react';
import { ppeCatalog } from '@/data/mockData';
import { DataTable } from '@/components/UI/DataTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const Catalog = () => {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de EPIs</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciamento completo do catálogo de Equipamentos de Proteção Individual
          </p>
        </div>
        <Button className="bg-safety-blue hover:bg-safety-blue-dark">
          <Plus className="mr-2 h-4 w-4" /> Adicionar EPI
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Equipamentos Registrados</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={ppeCatalog}
            columns={[
              { 
                key: 'type', 
                header: 'Tipo',
              },
              { 
                key: 'description', 
                header: 'Descrição',
              },
              { 
                key: 'approvalNumber', 
                header: 'Nº CA',
                render: (item) => (
                  <Badge variant="outline">{item.approvalNumber}</Badge>
                )
              },
              { 
                key: 'supplier', 
                header: 'Fornecedor',
              },
              { 
                key: 'department', 
                header: 'Departamento',
              },
              { 
                key: 'currentStock', 
                header: 'Estoque Atual',
                render: (item) => (
                  <span className={
                    item.currentStock < item.minimumStock 
                      ? 'text-safety-red font-medium' 
                      : 'text-safety-green font-medium'
                  }>
                    {item.currentStock}
                  </span>
                )
              },
              { 
                key: 'actions', 
                header: 'Ações',
                render: () => (
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">Editar</Button>
                    <Button variant="outline" size="sm" className="text-safety-red border-safety-red hover:bg-safety-red/10">
                      Excluir
                    </Button>
                  </div>
                )
              }
            ]}
            searchable={true}
            searchKeys={['type', 'description', 'approvalNumber', 'supplier', 'department']}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default Catalog;
