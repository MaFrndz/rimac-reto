import { SQSEvent } from 'aws-lambda';
import mysql from 'mysql2/promise';

const dbConfig_pe = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_PE
};


const dbConfig_cl = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_CL
};

async function saveToMySQL(appointment: any, connection: mysql.Connection) {
  const query = `
    INSERT INTO appointments (
      id, insured_id, country_iso, schedule_id, center_id, 
      specialty_id, medic_id, appointment_date, status, created_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    appointment.id,
    appointment.insuredId,
    appointment.countryISO,
    appointment.schedule.scheduleId,
    appointment.schedule.centerId,
    appointment.schedule.specialtyId,
    appointment.schedule.medicId,
    appointment.schedule.date,
    appointment.status,
    appointment.createdAt
  ];

  await connection.execute(query, values);
}

export const appointment_pe = async (event: SQSEvent) => {
  const connection = await mysql.createConnection(dbConfig_pe);
  
  try {
    for (const record of event.Records) {
      console.log('📥 Procesando mensaje en PE:', record.body);
      const appointment = JSON.parse(record.body);
      
      // Guarda en MySQL
      await saveToMySQL(appointment, connection);
      
      console.log('✅ Appointment guardado en MySQL PE:', appointment.id);
    }
  } catch (error) {
    console.error('❌ Error procesando mensaje:', error);
    throw error;
  } finally {
    await connection.end();
  }
};

export const appointment_cl = async (event: SQSEvent) => {
  const connection = await mysql.createConnection(dbConfig_cl);
  
  try {
    for (const record of event.Records) {
      console.log('📥 Procesando mensaje en CL:', record.body);
      const appointment = JSON.parse(record.body);
      
      // Guarda en MySQL
      await saveToMySQL(appointment, connection);
      
      console.log('✅ Appointment guardado en MySQL CL:', appointment.id);
    }
  } catch (error) {
    console.error('❌ Error procesando mensaje:', error);
    throw error;
  } finally {
    await connection.end();
  }
};
