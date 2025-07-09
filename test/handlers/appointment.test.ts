import { appointmentHandler } from "../../src/handlers/appointment";
import { APIGatewayProxyEvent } from "aws-lambda";
 

// Mocks
jest.mock("../../src/infrastructure/dynamodb/AppointmentRepository", () => ({
  saveDynamoDBAppointment: jest.fn(),
  getDynamoAppointmentsByInsuredId: jest.fn().mockResolvedValue([]),
  updateDynamoAppointmentStatus: jest.fn(),
}));
jest.mock("../../src/infrastructure/sns/NotificationPublisher", () => ({
  publishSNSAppointment: jest.fn(),
}));

const saveMock = require("../../src/infrastructure/dynamodb/AppointmentRepository").saveDynamoDBAppointment;
const publishMock = require("../../src/infrastructure/sns/NotificationPublisher").publishSNSAppointment;

describe("Manejador de citas POST", () => {
  it("devuelve 400 si no se proporciona ningún cuerpo", async () => {
    const event = { httpMethod: 'POST' } as APIGatewayProxyEvent;

    const response = (await appointmentHandler(
      event as any,
      {} as any,
      () => {}
    )) as any;
    expect(response.statusCode).toBe(400);
  });
  
  it("devuelve 200 y lista vacía si se proporciona insuredId en GET", async () => {
    
    const event: any = { httpMethod: 'GET', queryStringParameters: { insuredId: '00123' } };
    const response = (await appointmentHandler(
      event as any,
      {} as any,
      () => {}
    )) as any;
    expect(response.statusCode).toBe(200);
    expect(JSON.parse(response.body)).toEqual([]);
  });
});
