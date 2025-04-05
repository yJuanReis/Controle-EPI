
// PPE Catalog types
export interface PPEItem {
  id: string;
  type: string;
  description: string;
  approvalNumber: string; // CA Number
  supplier: string;
  department: string;
  imageUrl: string;
  lifespanMonths: number;
  minimumStock: number;
  currentStock: number;
}

// Individual PPE instances
export interface PPEInstance {
  id: string;
  catalogItemId: string;
  acquisitionDate: string;
  expiryDate: string;
  status: 'available' | 'in-use' | 'discarded';
  maintenanceHistory: MaintenanceRecord[];
}

// Maintenance records
export interface MaintenanceRecord {
  id: string;
  date: string;
  description: string;
  performedBy: string;
}

// Employee data
export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  requiredPPE: string[]; // IDs of required PPE from catalog
  assignedPPE: string[]; // IDs of assigned specific PPE instances
  trainingHistory: TrainingRecord[];
}

// Training records
export interface TrainingRecord {
  id: string;
  date: string;
  trainingType: string;
  expiryDate: string;
  certificationCode?: string;
}

// Movement tracking
export interface PPEMovement {
  id: string;
  type: 'delivery' | 'return' | 'replacement' | 'discard';
  date: string;
  employeeId: string;
  ppeInstanceId: string;
  reason: string;
  authorizedBy: string;
  digitalSignature?: string;
}

// Stats for dashboard
export interface DashboardStats {
  totalEmployees: number;
  totalPPEItems: number;
  expiringPPECount: number;
  lowStockCount: number;
  movementsToday: number;
  complianceRate: number;
  pendingDeliveries: number;
}

// Alert types
export type AlertType = 'expiry' | 'stock' | 'compliance' | 'training' | 'maintenance';

export interface Alert {
  id: string;
  type: AlertType;
  message: string;
  severity: 'low' | 'medium' | 'high';
  date: string;
  relatedItemId?: string;
}
