// Interfaces de dominio para TypeScript

export interface Schedule {
  scheduleId: number;
  centerId: number;
  specialtyId: number;
  medicId: number;
  date: string;
}

export interface AppointmentRequest {
  id: string;
  insuredId: string;
  countryISO: 'PE' | 'CL';
  schedule: Schedule;
  status: AppointmentStatus;
  createdAt: string;
}

export enum AppointmentStatus {
  Pending = 'pending',
  Completed = 'completed',
}