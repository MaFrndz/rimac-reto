// env.js
require('dotenv').config();

module.exports = {
  db: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    pe_db: process.env.MYSQL_PE,
    cl_db: process.env.MYSQL_CL,
  }
};
