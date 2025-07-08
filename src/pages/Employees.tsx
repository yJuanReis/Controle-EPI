
import React, { useState } from 'react';
import { Employee } from '@/types';
import { DataTable } from '@/components/UI/DataTable';
import { Button } from '@/components/ui/button';
import { Plus, Edit, Trash2, UserPlus, UserMinus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { AddEditEmployeeDialog } from '@/components/Employees/AddEditEmployeeDialog';
import { DeleteEmployeeDialog } from '@/components/Employees/DeleteEmployeeDialog';
import { AssignPPEDialog } from '@/components/Employees/AssignPPEDialog';
import { ReturnPPEDialog } from '@/components/Employees/ReturnPPEDialog';
import { useEmployees } from '@/hooks/useEmployees';
import { useCatalog } from '@/hooks/useCatalog';
import { useInventory } from '@/hooks/useInventory';

const Employees = () => {
  const { employees, addEmployeeItem, updateEmployeeItem, deleteEmployeeItem } = useEmployees();
  const { catalogItems } = useCatalog();
  const { getInstanceDetails } = useInventory();
  const [addEditDialogOpen, setAddEditDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignPPEDialogOpen, setAssignPPEDialogOpen] = useState(false);
  const [returnPPEDialogOpen, setReturnPPEDialogOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const handleAddEmployee = () => {
    setSelectedEmployee(null);
    setAddEditDialogOpen(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setAddEditDialogOpen(true);
  };

  const handleDeleteEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    setDeleteDialogOpen(true);
  };

  const handleAssignPPE = (employee: Employee) => {
    setSelectedEmployee(employee);
    setAssignPPEDialogOpen(true);
  };

  const handleReturnPPE = (employee: Employee) => {
    setSelectedEmployee(employee);
    setReturnPPEDialogOpen(true);
  };

  const handleSaveEmployee = (employee: Employee) => {
    if (selectedEmployee) {
      updateEmployeeItem(employee);
    } else {
      addEmployeeItem(employee);
    }
  };

  const handleConfirmDelete = (employeeId: string) => {
    deleteEmployeeItem(employeeId);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Colaboradores</h1>
          <p className="text-muted-foreground mt-1">
            Gerenciamento de colaboradores e seus equipamentos de proteção
          </p>
        </div>
        <Button 
          className="bg-safety-blue hover:bg-safety-blue-dark"
          onClick={handleAddEmployee}
        >
          <Plus className="mr-2 h-4 w-4" /> Novo Colaborador
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Lista de Colaboradores ({employees.length})</CardTitle>
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
                        const ppe = catalogItems.find(p => p.id === ppeId);
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
                 key: 'assignedPPE', 
                 header: 'EPIs Atribuídos',
                  render: (item) => (
                    <div className="flex flex-wrap gap-1">
                      {item.assignedPPE.map((instanceId, index) => {
                        const details = getInstanceDetails(instanceId);
                        return (
                          <Badge key={index} variant="outline" className="bg-safety-green/10">
                            {details?.catalogItem?.type || 'EPI'}
                          </Badge>
                        );
                      })}
                      {item.assignedPPE.length === 0 && (
                        <span className="text-muted-foreground text-sm">Nenhum</span>
                      )}
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
                  render: (item) => (
                    <div className="flex flex-wrap gap-1">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEditEmployee(item)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Editar
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-safety-blue border-safety-blue hover:bg-safety-blue/10"
                        onClick={() => handleAssignPPE(item)}
                      >
                        <UserPlus className="h-4 w-4 mr-1" />
                        Atribuir EPI
                      </Button>
                      {item.assignedPPE.length > 0 && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-safety-orange border-safety-orange hover:bg-safety-orange/10"
                          onClick={() => handleReturnPPE(item)}
                        >
                          <UserMinus className="h-4 w-4 mr-1" />
                          Devolver EPI
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="text-safety-red border-safety-red hover:bg-safety-red/10"
                        onClick={() => handleDeleteEmployee(item)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Excluir
                      </Button>
                    </div>
                  )
                }
            ]}
            searchable={true}
            searchKeys={['name', 'position', 'department']}
          />
        </CardContent>
      </Card>

      <AddEditEmployeeDialog
        open={addEditDialogOpen}
        onOpenChange={setAddEditDialogOpen}
        employee={selectedEmployee}
        onSave={handleSaveEmployee}
      />

      <DeleteEmployeeDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        employee={selectedEmployee}
        onDelete={handleConfirmDelete}
      />

      <AssignPPEDialog
        open={assignPPEDialogOpen}
        onOpenChange={setAssignPPEDialogOpen}
        employee={selectedEmployee}
      />

      <ReturnPPEDialog
        open={returnPPEDialogOpen}
        onOpenChange={setReturnPPEDialogOpen}
        employee={selectedEmployee}
      />
    </div>
  );
};

export default Employees;
