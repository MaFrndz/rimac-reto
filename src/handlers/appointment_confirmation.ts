import { SQSEvent, SQSHandler } from "aws-lambda";
import { AppointmentRequest, AppointmentStatus } from "../domain/models/types";
import { updateDynamoAppointmentStatus } from "../infrastructure/dynamodb/AppointmentRepository";
 
 
export const processCompletionFromSQS: SQSHandler = async (event: SQSEvent) => {
  console.log("Paso 9: Procesando finalización de cita desde SQS");
  for (const record of event.Records) {
    const eventDetail = JSON.parse(record.body);
    const appointment: AppointmentRequest = eventDetail.detail;
    console.log("Paso 10: Objeto de cita parseado", appointment);

    try {
      await updateDynamoAppointmentStatus(
        appointment.id,
        AppointmentStatus.Completed
      );
      console.log("Paso 11: Estado de la cita actualizado a completado en DynamoDB");
    } catch (error) {
      console.error("Error al actualizar el estado de la cita:", error);
      throw error;
    }
  }
};
