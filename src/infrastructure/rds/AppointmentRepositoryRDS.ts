import mysql, { Pool } from "mysql2/promise";
import { AppointmentRequest } from "../../domain/models/types";

/**
 * MySQL connection pools keyed by country ISO code.
 * Separate pools for PE and CL databases.
 */
const pools: Record<string, Pool> = {
  PE: mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_PE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }),
  CL: mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_CL,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  }),
};

/**
 * Saves an appointment to the appropriate RDS database based on countryISO.
 *
 * @param appointment - Appointment object to be saved.
 * @throws Error if no pool is defined for the given countryISO.
 */
export async function saveAppointmentRDS(
  appointment: AppointmentRequest
): Promise<void> {
  const pool = pools[appointment.countryISO];

  if (!pool) {
    throw new Error(`No pool defined for country: ${appointment.countryISO}`);
  }

  const sql = `INSERT INTO appointments (id, insured_id, schedule_id, center_id, specialty_id, medic_id, appointment_date, country_iso, status, created_at)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

               console.log("SQL Query:", appointment);
  const values = [
    appointment.id,
    appointment.insuredId,
    appointment.schedule.scheduleId,
    appointment.schedule.centerId,
    appointment.schedule.specialtyId,
    appointment.schedule.medicId,
    appointment.schedule.date,
    appointment.countryISO,
    appointment.status,
    appointment.createdAt,
  ];

  const conn = await pool.getConnection();
  try {
    await conn.execute(sql, values);
  } finally {
    conn.release();
  }
}
