import { useState, useEffect } from 'react';
import { PPEInstance, PPEMovement, Employee } from '@/types';
import { 
  ppeInstances as initialInstances, 
  ppeMovements as initialMovements,
  updatePPEInstances, 
  updatePPEMovements 
} from '@/data/mockData';
import { useEmployees } from './useEmployees';
import { useCatalog } from './useCatalog';

export const useInventory = () => {
  const [instances, setInstances] = useState<PPEInstance[]>(initialInstances);
  const [movements, setMovements] = useState<PPEMovement[]>(initialMovements);
  const { updateEmployeeItem } = useEmployees();
  const { catalogItems, updateItem } = useCatalog();

  useEffect(() => {
    setInstances(initialInstances);
    setMovements(initialMovements);
  }, []);

  const getAvailableInstances = (catalogItemId: string): PPEInstance[] => {
    return instances.filter(instance => 
      instance.catalogItemId === catalogItemId && instance.status === 'available'
    );
  };

  const assignPPEToEmployee = async (
    catalogItemId: string, 
    employeeId: string, 
    employee: Employee,
    reason: string = 'Entrega padrão'
  ): Promise<boolean> => {
    try {
      // Find an available instance of the requested PPE
      const availableInstance = instances.find(instance => 
        instance.catalogItemId === catalogItemId && instance.status === 'available'
      );

      if (!availableInstance) {
        throw new Error('Nenhuma instância disponível deste EPI');
      }

      // Update the instance status to in-use
      const updatedInstances = instances.map(instance => 
        instance.id === availableInstance.id
          ? { ...instance, status: 'in-use' as const }
          : instance
      );

      // Create a movement record
      const newMovement: PPEMovement = {
        id: `mov-${Date.now()}`,
        type: 'delivery',
        date: new Date().toISOString(),
        employeeId: employeeId,
        ppeInstanceId: availableInstance.id,
        reason: reason,
        authorizedBy: 'Admin do Sistema',
        digitalSignature: `sig-${Date.now()}`
      };

      // Update employee's assigned PPE
      const updatedEmployee: Employee = {
        ...employee,
        assignedPPE: [...employee.assignedPPE, availableInstance.id]
      };

      // Update the catalog item stock count
      const catalogItem = catalogItems.find(item => item.id === catalogItemId);
      if (catalogItem && catalogItem.currentStock > 0) {
        const updatedCatalogItem = {
          ...catalogItem,
          currentStock: catalogItem.currentStock - 1
        };
        updateItem(updatedCatalogItem);
      }

      // Save all updates
      const instancesSuccess = updatePPEInstances(updatedInstances);
      const movementsSuccess = updatePPEMovements([...movements, newMovement]);
      const employeeSuccess = updateEmployeeItem(updatedEmployee);

      if (instancesSuccess && movementsSuccess && employeeSuccess) {
        setInstances(updatedInstances);
        setMovements([...movements, newMovement]);
        return true;
      } else {
        throw new Error('Falha ao salvar uma ou mais atualizações');
      }
    } catch (error) {
      console.error('Erro ao atribuir EPI:', error);
      return false;
    }
  };

  const returnPPEFromEmployee = async (
    instanceId: string,
    employeeId: string,
    employee: Employee,
    reason: string = 'Devolução'
  ): Promise<boolean> => {
    try {
      // Find the instance
      const instance = instances.find(inst => inst.id === instanceId);
      if (!instance) {
        throw new Error('Instância do EPI não encontrada');
      }

      // Update the instance status to available
      const updatedInstances = instances.map(inst => 
        inst.id === instanceId
          ? { ...inst, status: 'available' as const }
          : inst
      );

      // Create a movement record
      const newMovement: PPEMovement = {
        id: `mov-${Date.now()}`,
        type: 'return',
        date: new Date().toISOString(),
        employeeId: employeeId,
        ppeInstanceId: instanceId,
        reason: reason,
        authorizedBy: 'Admin do Sistema',
        digitalSignature: `sig-${Date.now()}`
      };

      // Update employee's assigned PPE
      const updatedEmployee: Employee = {
        ...employee,
        assignedPPE: employee.assignedPPE.filter(id => id !== instanceId)
      };

      // Update the catalog item stock count
      const catalogItem = catalogItems.find(item => item.id === instance.catalogItemId);
      if (catalogItem) {
        const updatedCatalogItem = {
          ...catalogItem,
          currentStock: catalogItem.currentStock + 1
        };
        updateItem(updatedCatalogItem);
      }

      // Save all updates
      const instancesSuccess = updatePPEInstances(updatedInstances);
      const movementsSuccess = updatePPEMovements([...movements, newMovement]);
      const employeeSuccess = updateEmployeeItem(updatedEmployee);

      if (instancesSuccess && movementsSuccess && employeeSuccess) {
        setInstances(updatedInstances);
        setMovements([...movements, newMovement]);
        return true;
      } else {
        throw new Error('Falha ao salvar uma ou mais atualizações');
      }
    } catch (error) {
      console.error('Erro ao devolver EPI:', error);
      return false;
    }
  };

  const getInstanceDetails = (instanceId: string) => {
    const instance = instances.find(inst => inst.id === instanceId);
    if (!instance) return null;
    
    const catalogItem = catalogItems.find(item => item.id === instance.catalogItemId);
    return {
      instance,
      catalogItem
    };
  };

  return {
    instances,
    movements,
    assignPPEToEmployee,
    returnPPEFromEmployee,
    getAvailableInstances,
    getInstanceDetails,
    refreshData: () => {
      setInstances(initialInstances);
      setMovements(initialMovements);
    }
  };
};