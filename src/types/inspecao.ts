export interface Inspecao {
  id: string;
  data: string;
  epiId: number;
  epiNome: string;
  epiCA: string;
  colaboradorId: number;
  colaboradorNome: string;
  status: 'aprovado' | 'alerta' | 'reprovado';
  observacoes?: string;
  inspetor: string;
  proximaInspecao?: string;
}

export interface InspecaoFormData {
  epiId: number;
  colaboradorId: number;
  status: 'aprovado' | 'alerta' | 'reprovado';
  observacoes?: string;
  inspetor: string;
  proximaInspecao?: string;
}