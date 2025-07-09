import { DynamoDBClient, QueryCommand } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { AppointmentRequest, AppointmentStatus } from "../../domain/models/types";

const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

export async function saveDynamoDBAppointment(appointment: AppointmentRequest) {
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



export async function updateDynamoAppointmentStatus(
  id: string,
  status: AppointmentStatus
): Promise<void> {
  await ddbDocClient.send(
    new UpdateCommand({
      TableName: 'appointments',
      Key: { id },
      UpdateExpression: "set #status = :status, updatedAt = :updatedAt",
      ExpressionAttributeNames: {
        "#status": "status",
      },
      ExpressionAttributeValues: {
        ":status": status,
        ":updatedAt": new Date().toISOString(),
      },
    })
  );
}


export async function getDynamoAppointmentsByInsuredId(
  insuredId: string
): Promise<AppointmentRequest[]> {
  const result = await ddbDocClient.send(
    new QueryCommand({
      TableName: 'appointments',
      IndexName: 'insuredId-index',
      KeyConditionExpression: '#insuredId = :insuredId',
      ExpressionAttributeNames: {
        '#insuredId': 'insuredId',
      },
      ExpressionAttributeValues: {
        ':insuredId': { S: insuredId },
      },
    })
  );
    console.log("Paso 2: Resultado de la consulta en DynamoDB", result);
  return result.Items?.map((item) => unmarshall(item) as AppointmentRequest) ?? [];
}
