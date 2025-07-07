import { useState, useEffect } from 'react';
import { PPEItem } from '@/types';
import { 
  getCatalogItems, 
  addCatalogItem, 
  updateCatalogItem, 
  deleteCatalogItem 
} from '@/utils/catalogStorage';

export const useCatalog = () => {
  const [catalogItems, setCatalogItems] = useState<PPEItem[]>([]);

  useEffect(() => {
    setCatalogItems(getCatalogItems());
  }, []);

  const addItem = (item: PPEItem) => {
    const updatedItems = addCatalogItem(item);
    setCatalogItems(updatedItems);
    return updatedItems;
  };

  const updateItem = (item: PPEItem) => {
    const updatedItems = updateCatalogItem(item);
    setCatalogItems(updatedItems);
    return updatedItems;
  };

  const deleteItem = (itemId: string) => {
    const updatedItems = deleteCatalogItem(itemId);
    setCatalogItems(updatedItems);
    return updatedItems;
  };

  const getItemById = (itemId: string): PPEItem | undefined => {
    return catalogItems.find(item => item.id === itemId);
  };

  const getItemsByDepartment = (department: string): PPEItem[] => {
    return catalogItems.filter(item => item.department === department);
  };

  const getLowStockItems = (): PPEItem[] => {
    return catalogItems.filter(item => item.currentStock < item.minimumStock);
  };

  return {
    catalogItems,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    getItemsByDepartment,
    getLowStockItems,
    refreshItems: () => setCatalogItems(getCatalogItems())
  };
};