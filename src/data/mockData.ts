import { 
  PPEItem, 
  PPEInstance, 
  Employee, 
  PPEMovement, 
  DashboardStats, 
  Alert 
} from '../types';

// PPE Catalog data
export const ppeCatalog: PPEItem[] = [
  {
    id: 'ppe-001',
    type: 'Capacete',
    description: 'Capacete de segurança Classe B com carneira',
    approvalNumber: 'CA-12345',
    supplier: 'SafetyBras',
    department: 'Construção',
    imageUrl: '/placeholder.svg',
    lifespanMonths: 36,
    minimumStock: 20,
    currentStock: 35,
  },
  {
    id: 'ppe-002',
    type: 'Luvas',
    description: 'Luvas de proteção contra cortes e abrasão',
    approvalNumber: 'CA-23456',
    supplier: 'ProtecMãos',
    department: 'Manutenção',
    imageUrl: '/placeholder.svg',
    lifespanMonths: 6,
    minimumStock: 50,
    currentStock: 40,
  },
  {
    id: 'ppe-003',
    type: 'Óculos',
    description: 'Óculos de proteção com lente incolor antiembaçante',
    approvalNumber: 'CA-34567',
    supplier: 'VistoSeg',
    department: 'Laboratório',
    imageUrl: '/placeholder.svg',
    lifespanMonths: 12,
    minimumStock: 30,
    currentStock: 62,
  },
  {
    id: 'ppe-004',
    type: 'Protetor Auricular',
    description: 'Protetor auricular tipo plug de silicone com cordão',
    approvalNumber: 'CA-45678',
    supplier: 'AudiProtec',
    department: 'Produção',
    imageUrl: '/placeholder.svg',
    lifespanMonths: 3,
    minimumStock: 100,
    currentStock: 85,
  },
  {
    id: 'ppe-005',
    type: 'Máscara',
    description: 'Respirador semifacial PFF2 com válvula',
    approvalNumber: 'CA-56789',
    supplier: 'RespiraSeg',
    department: 'Químico',
    imageUrl: '/placeholder.svg',
    lifespanMonths: 1,
    minimumStock: 200,
    currentStock: 230,
  },
  {
    id: 'ppe-006',
    type: 'Bota',
    description: 'Bota de segurança com biqueira de composite',
    approvalNumber: 'CA-67890',
    supplier: 'PassoSeguro',
    department: 'Manutenção',
    imageUrl: '/placeholder.svg',
    lifespanMonths: 12,
    minimumStock: 40,
    currentStock: 28,
  }
];

// PPE Instances
export const ppeInstances: PPEInstance[] = [
  {
    id: 'inst-001',
    catalogItemId: 'ppe-001',
    acquisitionDate: '2023-06-15',
    expiryDate: '2026-06-15',
    status: 'available',
    maintenanceHistory: []
  },
  {
    id: 'inst-002',
    catalogItemId: 'ppe-002',
    acquisitionDate: '2023-09-01',
    expiryDate: '2024-03-01',
    status: 'in-use',
    maintenanceHistory: []
  },
  {
    id: 'inst-003',
    catalogItemId: 'ppe-003',
    acquisitionDate: '2023-05-20',
    expiryDate: '2024-05-20',
    status: 'in-use',
    maintenanceHistory: [
      {
        id: 'maint-001',
        date: '2023-11-10',
        description: 'Substituição da lente',
        performedBy: 'João Silva'
      }
    ]
  },
  {
    id: 'inst-004',
    catalogItemId: 'ppe-006',
    acquisitionDate: '2023-07-15',
    expiryDate: '2024-07-15',
    status: 'in-use',
    maintenanceHistory: []
  },
  {
    id: 'inst-005',
    catalogItemId: 'ppe-005',
    acquisitionDate: '2024-03-01',
    expiryDate: '2024-04-01',
    status: 'available',
    maintenanceHistory: []
  }
];

// Employees
export const employees: Employee[] = [
  {
    id: 'emp-001',
    name: 'Carlos Oliveira',
    position: 'Engenheiro de Segurança',
    department: 'Segurança do Trabalho',
    requiredPPE: ['ppe-001', 'ppe-003'],
    assignedPPE: ['inst-001', 'inst-003'],
    trainingHistory: [
      {
        id: 'train-001',
        date: '2023-01-15',
        trainingType: 'NR-35: Trabalho em Altura',
        expiryDate: '2025-01-15',
        certificationCode: 'CERT-35-12345'
      }
    ]
  },
  {
    id: 'emp-002',
    name: 'Ana Sousa',
    position: 'Técnica de Laboratório',
    department: 'Laboratório',
    requiredPPE: ['ppe-003', 'ppe-005'],
    assignedPPE: [],
    trainingHistory: []
  },
  {
    id: 'emp-003',
    name: 'Roberto Santos',
    position: 'Operador de Manutenção',
    department: 'Manutenção',
    requiredPPE: ['ppe-001', 'ppe-002', 'ppe-006'],
    assignedPPE: ['inst-002', 'inst-004'],
    trainingHistory: [
      {
        id: 'train-002',
        date: '2023-05-20',
        trainingType: 'NR-10: Segurança em Instalações Elétricas',
        expiryDate: '2025-05-20',
        certificationCode: 'CERT-10-67890'
      }
    ]
  },
  {
    id: 'emp-004',
    name: 'Mariana Lima',
    position: 'Operadora de Produção',
    department: 'Produção',
    requiredPPE: ['ppe-001', 'ppe-004'],
    assignedPPE: [],
    trainingHistory: []
  },
  {
    id: 'emp-005',
    name: 'Paulo Mendes',
    position: 'Técnico Químico',
    department: 'Químico',
    requiredPPE: ['ppe-003', 'ppe-005'],
    assignedPPE: [],
    trainingHistory: [
      {
        id: 'train-003',
        date: '2023-08-10',
        trainingType: 'NR-33: Espaços Confinados',
        expiryDate: '2024-08-10',
        certificationCode: 'CERT-33-54321'
      }
    ]
  }
];

// PPE Movements
export const ppeMovements: PPEMovement[] = [
  {
    id: 'mov-001',
    type: 'delivery',
    date: '2024-03-01T08:30:00Z',
    employeeId: 'emp-001',
    ppeInstanceId: 'inst-001',
    reason: 'Entrega inicial',
    authorizedBy: 'Maria Gomes',
    digitalSignature: 'sig-12345'
  },
  {
    id: 'mov-002',
    type: 'delivery',
    date: '2024-03-01T09:15:00Z',
    employeeId: 'emp-003',
    ppeInstanceId: 'inst-002',
    reason: 'Entrega inicial',
    authorizedBy: 'Maria Gomes',
    digitalSignature: 'sig-12346'
  },
  {
    id: 'mov-003',
    type: 'replacement',
    date: '2024-03-02T14:20:00Z',
    employeeId: 'emp-001',
    ppeInstanceId: 'inst-003',
    reason: 'Substituição por dano',
    authorizedBy: 'Pedro Alves',
    digitalSignature: 'sig-12347'
  },
  {
    id: 'mov-004',
    type: 'delivery',
    date: '2024-03-03T11:00:00Z',
    employeeId: 'emp-003',
    ppeInstanceId: 'inst-004',
    reason: 'Entrega adicional',
    authorizedBy: 'Maria Gomes',
    digitalSignature: 'sig-12348'
  },
  {
    id: 'mov-005',
    type: 'return',
    date: '2024-04-01T16:45:00Z',
    employeeId: 'emp-002',
    ppeInstanceId: 'inst-005',
    reason: 'Devolução por férias',
    authorizedBy: 'Pedro Alves',
    digitalSignature: 'sig-12349'
  }
];

// Dashboard Statistics
export const dashboardStats: DashboardStats = {
  totalEmployees: 5,
  totalPPEItems: 6,
  expiringPPECount: 2,
  lowStockCount: 1,
  movementsToday: 3,
  complianceRate: 85,
  pendingDeliveries: 4
};

// Alerts
export const alerts: Alert[] = [
  {
    id: 'alert-001',
    type: 'stock',
    message: 'Estoque baixo: Botas de segurança',
    severity: 'medium',
    date: '2024-04-05T08:00:00Z',
    relatedItemId: 'ppe-006'
  },
  {
    id: 'alert-002',
    type: 'expiry',
    message: 'EPIs próximos da validade: 5 máscaras PFF2',
    severity: 'high',
    date: '2024-04-05T08:00:00Z',
    relatedItemId: 'ppe-005'
  },
  {
    id: 'alert-003',
    type: 'training',
    message: 'Treinamento a vencer: NR-33 para Paulo Mendes',
    severity: 'medium',
    date: '2024-04-04T10:30:00Z',
    relatedItemId: 'emp-005'
  },
  {
    id: 'alert-004',
    type: 'compliance',
    message: 'Funcionários sem EPIs obrigatórios: 2',
    severity: 'high',
    date: '2024-04-04T09:15:00Z'
  },
  {
    id: 'alert-005',
    type: 'maintenance',
    message: 'Manutenção programada: Capacetes de segurança',
    severity: 'low',
    date: '2024-04-03T14:20:00Z',
    relatedItemId: 'ppe-001'
  }
];
