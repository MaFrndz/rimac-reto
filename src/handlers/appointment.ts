import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";
import { createAppointment } from "../application/scheduleAppointment";
 
import { hasRequiredFields, isValidCountryISO } from "../utils/validation";
import { createResponse } from "../utils/response";
import { ERROR, MESSAGES } from "../utils/constants";
import { getDynamoAppointmentsByInsuredId, saveDynamoDBAppointment } from "../infrastructure/dynamodb/AppointmentRepository";
import { publishSNSAppointment } from "../infrastructure/sns/NotificationPublisher";


export const appointmentHandler: APIGatewayProxyHandler = async (event) => {
  try {
    switch (event.httpMethod) {
      case "POST":
        return await handlePostAppointment(event);
      case "GET":
        return await handleGetAppointments(event);
      default:
        return createResponse(405, {
          error: ERROR.METHOD_NOT_ALLOWED,
          details: MESSAGES.METHOD_NOT_ALLOWED,
        });
    }
  } catch (error) {
    console.error(error);
    return createResponse(500, {
      error: ERROR.INTERNAL_SERVER_ERROR,
      details: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};


const handlePostAppointment = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    console.log("Paso 1: Solicitud POST recibida para crear cita");
    if (!event.body) {
      return createResponse(400, {
        error: ERROR.MISSING_BODY,
        details: MESSAGES.MISSING_BODY,
      });
    }
    const body = JSON.parse(event.body);
    if (!hasRequiredFields(body)) {
      return createResponse(400, {
        error: ERROR.MISSING_REQUIRED_FIELDS,
        details: MESSAGES.MISSING_REQUIRED_FIELDS,
      });
    }
    if (!isValidCountryISO(body.countryISO)) {
      return createResponse(422, {
        error: ERROR.INVALID_COUNTRY_ISO,
        details: MESSAGES.INVALID_COUNTRY_ISO,
      });
    }

    const appointment = createAppointment(body);
    console.log("Paso 2: Objeto de cita creado", appointment);

    await saveDynamoDBAppointment(appointment);
    console.log("Paso 3: Cita guardada en DynamoDB");

    await publishSNSAppointment(appointment);
    console.log("Paso 4: Cita publicada en SNS");

    return createResponse(202, {
      message: MESSAGES.APPOINTMENT_SCHEDULED,
      appointmentId: appointment.id,
    });
  } catch (error) {
    console.error(error);
    return createResponse(500, {
      error: ERROR.INTERNAL_SERVER_ERROR,
      details: MESSAGES.INTERNAL_SERVER_ERROR,
    });
  }
};


const handleGetAppointments = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  const insuredId = event.queryStringParameters?.insuredId;
  console.log("Paso 1: Solicitud GET recibida para listar citas del insuredId:", insuredId);
  if (!insuredId) {
    return createResponse(400, {
      error: MESSAGES.MISSING_REQUIRED_FIELDS,
      details: "Missing insuredId param",
    });
  }

  const appointments = await getDynamoAppointmentsByInsuredId(insuredId);

  return createResponse(200, appointments);
};
