const { poolSYS } = require("../database");
const sql = require("mssql");

const getStatusCodes = async (data) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .query(`SELECT*FROM SYS_STATUS_CODES`);

    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

module.exports = {
  getStatusCodes,
};
