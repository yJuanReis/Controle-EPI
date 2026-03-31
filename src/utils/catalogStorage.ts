import { PPEItem } from '@/types';
import { ppeCatalog as initialCatalog } from '@/data/mockData';

const CATALOG_STORAGE_KEY = 'ppe_catalog';

export const getCatalogItems = (): PPEItem[] => {
  try {
    const stored = localStorage.getItem(CATALOG_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Se não há dados armazenados, usa os dados mock iniciais
    saveCatalogItems(initialCatalog);
    return initialCatalog;
  } catch (error) {
    console.error('Error loading catalog from storage:', error);
    return initialCatalog;
  }
};

export const saveCatalogItems = (items: PPEItem[]): void => {
  try {
    localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Error saving catalog to storage:', error);
  }
};

export const addCatalogItem = (item: PPEItem): PPEItem[] => {
  const items = getCatalogItems();
  const newItems = [...items, item];
  saveCatalogItems(newItems);
  return newItems;
};

export const updateCatalogItem = (updatedItem: PPEItem): PPEItem[] => {
  const items = getCatalogItems();
  const newItems = items.map(item => 
    item.id === updatedItem.id ? updatedItem : item
  );
  saveCatalogItems(newItems);
  return newItems;
};

export const deleteCatalogItem = (itemId: string): PPEItem[] => {
  const items = getCatalogItems();
  const newItems = items.filter(item => item.id !== itemId);
  saveCatalogItems(newItems);
  return newItems;
};

export const updateCatalogItemStock = (itemId: string, newStock: number): PPEItem[] => {
  const items = getCatalogItems();
  const newItems = items.map(item => 
    item.id === itemId ? { ...item, currentStock: newStock } : item
  );
  saveCatalogItems(newItems);
  return newItems;
};