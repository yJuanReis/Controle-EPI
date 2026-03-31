import { Employee } from '@/types';
import { employees as initialEmployees } from '@/data/mockData';

const EMPLOYEES_STORAGE_KEY = 'employees_data';

export const getEmployees = (): Employee[] => {
  try {
    const stored = localStorage.getItem(EMPLOYEES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
    // Se não há dados armazenados, usa os dados mock iniciais
    saveEmployees(initialEmployees);
    return initialEmployees;
  } catch (error) {
    console.error('Error loading employees from storage:', error);
    return initialEmployees;
  }
};

export const saveEmployees = (employees: Employee[]): void => {
  try {
    localStorage.setItem(EMPLOYEES_STORAGE_KEY, JSON.stringify(employees));
  } catch (error) {
    console.error('Error saving employees to storage:', error);
  }
};

export const addEmployee = (employee: Employee): Employee[] => {
  const employees = getEmployees();
  const newEmployees = [...employees, employee];
  saveEmployees(newEmployees);
  return newEmployees;
};

export const updateEmployee = (updatedEmployee: Employee): Employee[] => {
  const employees = getEmployees();
  const newEmployees = employees.map(employee => 
    employee.id === updatedEmployee.id ? updatedEmployee : employee
  );
  saveEmployees(newEmployees);
  return newEmployees;
};

export const deleteEmployee = (employeeId: string): Employee[] => {
  const employees = getEmployees();
  const newEmployees = employees.filter(employee => employee.id !== employeeId);
  saveEmployees(newEmployees);
  return newEmployees;
};