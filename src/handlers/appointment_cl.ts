import { SQSEvent, SQSHandler } from "aws-lambda";
import { saveAppointmentRDS } from "../infrastructure/rds/AppointmentRepositoryRDS";
import { AppointmentRequest } from "../domain/models/types";
import { publishAppointmentCompleted } from "../infrastructure/eventbridge/EventPublisher";

export const handler: SQSHandler = async (event: SQSEvent) => {
  console.log("Step 5: Processing appointment from SQS_CL");
  for (const record of event.Records) {
    const snsMessage = JSON.parse(record.body);
    const appointment: AppointmentRequest = JSON.parse(snsMessage.Message);
    console.log("Step 6: Parsed appointment object", appointment);

    try {
      await saveAppointmentRDS(appointment);
      console.log("Step 7: Saved appointment to MySQL");

      await publishAppointmentCompleted(appointment);
      console.log("Step 8: Published appointment completion to EventBridge");
    } catch (error) {
      console.error("Error processing CL appointment:", error);
      throw error;
    }
  }
};
