import { AppointmentRequest, AppointmentStatus, Schedule } from "../domain/models/types";
import { v4 as uuidv4 } from "uuid";
// Stub para createAppointment
export function createAppointment(input: {
  insuredId: string;
  schedule: Schedule;
  countryISO: "PE" | "CL";
}): AppointmentRequest {
  return {
    id: uuidv4(),
    insuredId: input.insuredId,
    schedule: input.schedule,
    countryISO: input.countryISO,
    status: AppointmentStatus.Pending,
    createdAt: new Date().toISOString(),
  };
}