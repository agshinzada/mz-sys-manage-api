require("dotenv").config();
const sql = require("mssql");
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_CLIENT,
  server: process.env.DB_HOST,
  options: {
    encrypt: process.env.DB_ENCRYPT === "true",
    trustServerCertificate: process.env.DB_CERTIFICATE === "true", // change to true for local dev / self-signed certs
    enableArithAbort: true,
    connectionTimeout: 15000,
    requestTimeout: 30000,
    pool: {
      max: 50,
      min: 0,
      idleTimeoutMillis: 30000,
      acquireTimeoutMillis: 30000,
    },
  },
};

const pool = new sql.ConnectionPool(config);

const getBrands = async () => {
  try {
    await pool.connect();
    const result = await pool
      .request()
      .query(`SELECT * FROM ${process.env.CLIENT_TABLE_NAME1} WITH (NOLOCK)`);

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    pool.release();
  }
};

module.exports = {
  getBrands,
};
