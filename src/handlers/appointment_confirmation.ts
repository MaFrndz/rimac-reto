import { SQSEvent, SQSHandler } from "aws-lambda";
import { AppointmentRequest, AppointmentStatus } from "../domain/models/types";
import { updateDynamoAppointmentStatus } from "../infrastructure/dynamodb/AppointmentRepository";
 
 
export const processCompletionFromSQS: SQSHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const eventDetail = JSON.parse(record.body);
    const appointment: AppointmentRequest = eventDetail.detail;
    try {
      await updateDynamoAppointmentStatus(
        appointment.id,
        AppointmentStatus.Completed
      );
    } catch (error) {
      console.error("Error updating appointment status:", error);
      throw error;
    }
  }
};
