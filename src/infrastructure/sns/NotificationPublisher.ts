import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";

const sns = new SNSClient({});
const TOPIC_ARN =  process.env.SNS_TOPIC_ARN!; // Debes definir esta variable en AWS

export async function publishSNSAppointment(appointment: any) {
  if (!TOPIC_ARN) {
    console.warn("TOPIC no está definido", TOPIC_ARN);
    return false;
  }
  //console.log("Publicando cita en SNS:",TOPIC_ARN, appointment);
  const params = {
    TopicArn: TOPIC_ARN,
    Message: JSON.stringify(appointment),
    Subject: "Nueva cita registrada",
  };
  await sns.send(new PublishCommand(params));
  return true;
}
