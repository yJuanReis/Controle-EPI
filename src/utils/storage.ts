
import { PPEItem, PPEInstance, Employee, PPEMovement } from '../types';

export const STORAGE_KEYS = {
  PPE_CATALOG: 'ppe_catalog',
  PPE_INSTANCES: 'ppe_instances',
  EMPLOYEES: 'employees',
  MOVEMENTS: 'movements'
};

/**
 * Carrega dados do localStorage com tratamento de erros
 * @param key Chave para buscar no localStorage
 * @param defaultValue Valor padrão caso não exista dados ou ocorra erro
 * @returns Dados carregados ou valor padrão
 */
export const loadStoredData = <T>(key: string, defaultValue: T): T => {
  try {
    const storedData = localStorage.getItem(key);
    if (!storedData) return defaultValue;
    return JSON.parse(storedData) as T;
  } catch (error) {
    console.error(`Erro ao carregar dados de ${key}:`, error);
    return defaultValue;
  }
};

/**
 * Salva dados no localStorage com tratamento de erros
 * @param key Chave para salvar no localStorage
 * @param data Dados a serem salvos
 * @returns boolean indicando sucesso da operação
 */
export const saveData = <T>(key: string, data: T): boolean => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Erro ao salvar dados em ${key}:`, error);
    return false;
  }
};

/**
 * Verifica se localStorage está disponível no navegador
 * @returns boolean indicando disponibilidade
 */
export const isStorageAvailable = (): boolean => {
  try {
    const testKey = '__storage_test__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    return true;
  } catch (e) {
    return false;
  }
};
