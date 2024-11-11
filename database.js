require("dotenv").config();
const sql = require("mssql");
const config = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_MOBIM,
  server: process.env.DB_HOST,
  options: {
    encrypt: false,
    trustServerCertificate: true, // change to true for local dev / self-signed certs
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
const config2 = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_CLIENT,
  server: process.env.DB_HOST,
  options: {
    encrypt: false,
    trustServerCertificate: true, // change to true for local dev / self-signed certs
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
const config3 = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_SYS,
  server: process.env.DB_HOST,
  options: {
    encrypt: false,
    trustServerCertificate: true, // change to true for local dev / self-signed certs
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

const config4 = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_MAZARINA,
  server: process.env.DB_HOST,
  options: {
    encrypt: false,
    trustServerCertificate: true, // change to true for local dev / self-signed certs
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
const config5 = {
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_MAIN,
  server: process.env.DB_HOST,
  options: {
    encrypt: false,
    trustServerCertificate: true, // change to true for local dev / self-signed certs
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

const poolMobim = new sql.ConnectionPool(config);
const poolClient = new sql.ConnectionPool(config2);
const poolSYS = new sql.ConnectionPool(config3);
const poolMazarina = new sql.ConnectionPool(config4);
const poolMain = new sql.ConnectionPool(config5);

module.exports = { poolMobim, poolClient, poolSYS, poolMazarina, poolMain };
