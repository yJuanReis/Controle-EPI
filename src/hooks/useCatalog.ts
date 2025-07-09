import { useState, useEffect } from 'react';
import { PPEItem } from '@/types';
import { 
  getCatalogItems, 
  addCatalogItem, 
  updateCatalogItem, 
  deleteCatalogItem,
  updateCatalogItemStock 
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

  const updateStock = (itemId: string, newStock: number) => {
    const updatedItems = updateCatalogItemStock(itemId, newStock);
    setCatalogItems(updatedItems);
    return updatedItems;
  };

  const decreaseStock = (itemId: string, quantity: number = 1) => {
    const item = getItemById(itemId);
    if (item) {
      const newStock = Math.max(0, item.currentStock - quantity);
      return updateStock(itemId, newStock);
    }
    return catalogItems;
  };

  const increaseStock = (itemId: string, quantity: number = 1) => {
    const item = getItemById(itemId);
    if (item) {
      const newStock = item.currentStock + quantity;
      return updateStock(itemId, newStock);
    }
    return catalogItems;
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
    updateStock,
    decreaseStock,
    increaseStock,
    getItemById,
    getItemsByDepartment,
    getLowStockItems,
    refreshItems: () => setCatalogItems(getCatalogItems())
  };
};