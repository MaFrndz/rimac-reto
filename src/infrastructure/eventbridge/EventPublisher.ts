import { EventBridgeClient, PutEventsCommand } from "@aws-sdk/client-eventbridge";
import { AppointmentRequest } from "../../domain/models/types";


const eventbridgeClient = new EventBridgeClient({});


export async function publishAppointmentCompleted(
  appointment: AppointmentRequest
): Promise<void> {
  const EVENT_BUS_NAME = process.env.EVENT_BUS_NAME!;

  // Log EventBridge publish details
  console.log("Paso 8: Publicando evento de cita completada en EventBridge", {
    eventBusName: EVENT_BUS_NAME,
    detail: appointment,
  });

  const command = new PutEventsCommand({
    Entries: [
      {
        EventBusName: EVENT_BUS_NAME,
        Source: "appointment",
        DetailType: "AppointmentCompleted",
        Detail: JSON.stringify(appointment),
      },
    ],
  });

  await eventbridgeClient.send(command);
}