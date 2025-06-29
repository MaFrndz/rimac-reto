import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export async function saveDynamoDBAppointment(appointment: any) {
  // Si no tiene id, genera uno simple (en real usar uuid)
  if (!appointment.id) {
    appointment.id = Date.now().toString();
  }
  const params = {
    TableName: "appointments",
    Item: appointment,
  };
  await ddbDocClient.send(new PutCommand(params));
  return appointment.id;
}
