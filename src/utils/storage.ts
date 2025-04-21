
import { PPEItem, PPEInstance, Employee, PPEMovement } from '../types';

const STORAGE_KEYS = {
  PPE_CATALOG: 'ppe_catalog',
  PPE_INSTANCES: 'ppe_instances',
  EMPLOYEES: 'employees',
  MOVEMENTS: 'movements'
};

export const loadStoredData = <T>(key: string, defaultValue: T): T => {
  const storedData = localStorage.getItem(key);
  return storedData ? JSON.parse(storedData) : defaultValue;
};

export const saveData = <T>(key: string, data: T): void => {
  localStorage.setItem(key, JSON.stringify(data));
};

