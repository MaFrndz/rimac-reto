import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { AppointmentRequest } from "../../domain/models/types";

const sns = new SNSClient({});
const TOPIC_ARN = process.env.SNS_TOPIC_ARN!; // Debes definir esta variable en AWS

export async function publishSNSAppointment(appointment: AppointmentRequest) {
  if (!TOPIC_ARN) {
    console.warn("SNS_TOPIC_ARN environment variable not set.");
    return false;
  }
  const params = {
    TopicArn: TOPIC_ARN,
    Message: JSON.stringify(appointment),
    Subject: "Nueva cita registrada",
    MessageAttributes: {
      countryISO: {
        DataType: "String",
        StringValue: appointment.countryISO,
      },
    },
  };
  console.log("Publishing to SNS with params:", params);
  try {
    await sns.send(new PublishCommand(params));
    console.log("Successfully published to SNS");
  } catch (error) {
    console.error("Error publishing to SNS:", error);
    throw error;
  }
  return true;
}
