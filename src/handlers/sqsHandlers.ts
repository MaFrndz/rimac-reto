import { SQSEvent, Context } from 'aws-lambda';

export const sqsPEHandler = async (event: SQSEvent, context: Context) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body);
    console.log('📥 Mensaje recibido en SQS_PE:', message);
    // Aquí puedes agregar lógica para procesar el mensaje
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};

export const sqsCLHandler = async (event: SQSEvent, context: Context) => {
  for (const record of event.Records) {
    const message = JSON.parse(record.body);
    console.log('📥 Mensaje recibido en SQS_CL:', message);
    // Aquí puedes agregar lógica para procesar el mensaje
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ received: true }),
  };
};
