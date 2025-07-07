
import React, { useState, useEffect } from 'react';
import { PPEItem } from '@/types';
import { DataTable } from '@/components/UI/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AddEditItemDialog } from '@/components/Catalog/AddEditItemDialog';
import { DeleteItemDialog } from '@/components/Catalog/DeleteItemDialog';
import { 
  getCatalogItems, 
  addCatalogItem, 
  updateCatalogItem, 
  deleteCatalogItem 
} from '@/utils/catalogStorage';

const Catalog = () => {
  const [catalogData, setCatalogData] = useState<PPEItem[]>([]);
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PPEItem | null>(null);

  useEffect(() => {
    setCatalogData(getCatalogItems());
  }, []);

  const handleAddItem = () => {
    setSelectedItem(null);
    setAddEditDialogOpen(true);
  };

  const handleEditItem = (item: PPEItem) => {
    setSelectedItem(item);
    setAddEditDialogOpen(true);
  };

  const handleDeleteItem = (item: PPEItem) => {
    setSelectedItem(item);
    setDeleteDialogOpen(true);
  };

  const handleSaveItem = (item: PPEItem) => {
    let updatedCatalog;
    if (selectedItem) {
      // Editando item existente
      updatedCatalog = updateCatalogItem(item);
    } else {
      // Adicionando novo item
      updatedCatalog = addCatalogItem(item);
    }
    setCatalogData(updatedCatalog);
  };

  const handleConfirmDelete = (itemId: string) => {
    const updatedCatalog = deleteCatalogItem(itemId);
    setCatalogData(updatedCatalog);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Catálogo de EPIs</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciamento completo do catálogo de Equipamentos de Proteção Individual
          </p>
        </div>
        <Button 
          className="bg-safety-blue hover:bg-safety-blue-dark"
          onClick={handleAddItem}
        >
          <Plus className="mr-2 h-4 w-4" /> Adicionar EPI
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Equipamentos Registrados ({catalogData.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={catalogData}
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
                render: (item) => (
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditItem(item)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-safety-red border-safety-red hover:bg-safety-red/10"
                      onClick={() => handleDeleteItem(item)}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
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

      <AddEditItemDialog
        open={addEditDialogOpen}
        onOpenChange={setAddEditDialogOpen}
        item={selectedItem}
        onSave={handleSaveItem}
      />

      <DeleteItemDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        item={selectedItem}
        onDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default Catalog;
