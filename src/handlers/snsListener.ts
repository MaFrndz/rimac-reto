import { SNSEvent, Context } from 'aws-lambda';

export const snsAppointmentListener = async (event: SNSEvent, context: Context) => {
  const message = JSON.parse(event.Records?.[0]?.Sns?.Message || '{}');
  console.log('📥 Mensaje SNS recibido:', message);
  // Aquí puedes agregar lógica adicional para procesar el mensaje
  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
