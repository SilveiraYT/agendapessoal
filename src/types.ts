export type Professional = 'Kah' | 'Márcia';

export type ServiceKah = 'Relaxante' | 'Terapêutica' | 'Modeladora' | 'Drenagem linfática' | 'Desportiva' | 'Bioenergética';
export type ServiceMarcia = 'Manicure' | 'Pedicure' | 'Alongamento de Unhas' | 'Design de Sobrancelhas' | 'Sobrancelha com Henna' | 'Micropigmentação' | 'Lash Lifting';

export interface Appointment {
  id: string;
  professional: Professional;
  service: string;
  clientName: string;
  phone: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  notes?: string;
  status?: 'agendado' | 'finalizado';
  createdAt: number;
  updatedAt: number;
  lastModifiedBy: Professional;
}
