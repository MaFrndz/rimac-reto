
import 'dotenv/config';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from "aws-lambda";

import { saveDynamoDBAppointment } from "../infrastructure/dynamodb/AppointmentRepository";
import { publishSNSAppointment } from "../infrastructure/sns/NotificationPublisher";
import { hasRequiredFields, isValidCountryISO } from "../utils/validation";
import { createResponse } from "../utils/response";
import { ERROR, MESSAGES } from "../utils/constants";
import { createAppointment } from "../application/scheduleAppointment";

/**
 * Lambda handler for POST /appointments.
 * Valida el body y agenda una nueva cita.
 */
export const appointmentHandler: APIGatewayProxyHandler = async (event) => {
  try {
    if (event.httpMethod !== "POST") {
      return createResponse(405, {
        error: ERROR.METHOD_NOT_ALLOWED,
        details: MESSAGES.METHOD_NOT_ALLOWED,
      });
    }
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
    await saveDynamoDBAppointment(appointment);
    await publishSNSAppointment(appointment);

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
