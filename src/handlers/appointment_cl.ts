import { SQSEvent, SQSHandler } from "aws-lambda";
import { saveAppointmentRDS } from "../infrastructure/rds/AppointmentRepositoryRDS";
import { AppointmentRequest } from "../domain/models/types";
import { publishAppointmentCompleted } from "../infrastructure/eventbridge/EventPublisher";

export const handler: SQSHandler = async (event: SQSEvent) => {
  console.log("Paso 5: Procesando cita desde SQS_CL");
  for (const record of event.Records) {
    const snsMessage = JSON.parse(record.body);
    const appointment: AppointmentRequest = JSON.parse(snsMessage.Message);
    console.log("Paso 6: Objeto de cita parseado", appointment);

    try {
      await saveAppointmentRDS(appointment);
      console.log("Paso 7: Cita guardada en MySQL");

      await publishAppointmentCompleted(appointment);
      console.log("Paso 8: Publicada finalización de cita en EventBridge");
    } catch (error) {
      console.error("Error processing CL appointment:", error);
      throw error;
    }
  }
};
