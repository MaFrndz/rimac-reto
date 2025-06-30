import { SQSEvent, SQSHandler } from "aws-lambda";
import { saveAppointmentRDS } from "../infrastructure/rds/AppointmentRepositoryRDS";
 
import { AppointmentRequest } from "../domain/models/types";
import { publishAppointmentCompleted } from "../infrastructure/eventbridge/EventPublisher";
 

export const handler: SQSHandler = async (event: SQSEvent) => {
  for (const record of event.Records) {
    const snsMessage = JSON.parse(record.body);
    const appointment: AppointmentRequest = JSON.parse(snsMessage.Message);
    try {
      await saveAppointmentRDS(appointment);

      await publishAppointmentCompleted(appointment);
    } catch (error) {
      console.error("Error processing PE appointment:", error);
      throw error;
    }
  }
};
