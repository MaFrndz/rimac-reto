import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { AppointmentRequest } from "../../domain/models/types";


const eventbridgeClient = new EventBridgeClient({});


export async function publishAppointmentCompleted(
  appointment: AppointmentRequest
): Promise<void> {
  const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME!;

  const command = new PutEventsCommand({
    Entries: [
      {
        EventBusName: EVENT_BUS_NAME,
        Source: "appointment.app",
        DetailType: "AppointmentCompleted",
        Detail: JSON.stringify(appointment),
      },
    ],
  });

  await eventbridgeClient.send(command);
}