import { AppointmentStatus } from "../../src/domain/models/types";

describe("Enumeración AppointmentStatus", () => {
  it("Debería tener Pendiente con valor 'pending'", () => {
    expect(AppointmentStatus.Pending).toBe('pending');
  });

  it("Debería tener Pendiente con valor 'completed''", () => {
    expect(AppointmentStatus.Completed).toBe('completed');
  });
});
