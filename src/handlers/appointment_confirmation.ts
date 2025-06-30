import { SQSEvent, SQSHandler } from "aws-lambda";
import { AppointmentRequest, AppointmentStatus } from "../domain/models/types";
import { updateDynamoAppointmentStatus } from "../infrastructure/dynamodb/AppointmentRepository";
 
 
export const processCompletionFromSQS: SQSHandler = async (event: SQSEvent) => {
  console.log("Step 9: Processing appointment completion from SQS");
  for (const record of event.Records) {
    const eventDetail = JSON.parse(record.body);
    const appointment: AppointmentRequest = eventDetail.detail;
    console.log("Step 10: Parsed appointment object", appointment);

    try {
      await updateDynamoAppointmentStatus(
        appointment.id,
        AppointmentStatus.Completed
      );
      console.log("Step 11: Updated appointment status to completed in DynamoDB");
    } catch (error) {
      console.error("Error updating appointment status:", error);
      throw error;
    }
  }
};
