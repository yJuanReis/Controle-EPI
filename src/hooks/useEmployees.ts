import { useState, useEffect } from 'react';
import { Employee } from '@/types';
import { 
  getEmployees, 
  addEmployee, 
  updateEmployee, 
  deleteEmployee 
} from '@/utils/employeeStorage';

export const useEmployees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    setEmployees(getEmployees());
  }, []);

  const addEmployeeItem = (employee: Employee) => {
    const updatedEmployees = addEmployee(employee);
    setEmployees(updatedEmployees);
    return updatedEmployees;
  };

  const updateEmployeeItem = (employee: Employee) => {
    const updatedEmployees = updateEmployee(employee);
    setEmployees(updatedEmployees);
    return updatedEmployees;
  };

  const deleteEmployeeItem = (employeeId: string) => {
    const updatedEmployees = deleteEmployee(employeeId);
    setEmployees(updatedEmployees);
    return updatedEmployees;
  };

  const getEmployeeById = (employeeId: string): Employee | undefined => {
    return employees.find(employee => employee.id === employeeId);
  };

  const getEmployeesByDepartment = (department: string): Employee[] => {
    return employees.filter(employee => employee.department === department);
  };

  const getEmployeesWithIncompletePPE = (): Employee[] => {
    return employees.filter(employee => 
      employee.requiredPPE.length !== employee.assignedPPE.length
    );
  };

  return {
    employees,
    addEmployeeItem,
    updateEmployeeItem,
    deleteEmployeeItem,
    getEmployeeById,
    getEmployeesByDepartment,
    getEmployeesWithIncompletePPE,
    refreshEmployees: () => setEmployees(getEmployees())
  };
};