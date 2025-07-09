import { createAppointment } from "../../src/application/scheduleAppointment";
import { AppointmentStatus, Schedule } from "../../src/domain/models/types";

describe("createAppointment", () => {
  it("Debe crear una solicitud de cita con las propiedades correctas", () => {
    const input = {
      insuredId: "12345",
      schedule: {
        scheduleId: 1,
        centerId: 101,
        specialtyId: 202,
        medicId: 303,
        date: "2025-07-01",
      } as Schedule,
      countryISO: "PE" as const,
    };

    const result = createAppointment(input);

    expect(typeof result.id).toBe("string");
    expect(result.id.length).toBeGreaterThan(0);

    expect(result.insuredId).toBe(input.insuredId);
    expect(result.schedule).toEqual(input.schedule);
    expect(result.countryISO).toBe(input.countryISO);

    expect(result.status).toBe(AppointmentStatus.Pending);

    expect(new Date(result.createdAt).toISOString()).toBe(result.createdAt);
  });
});
