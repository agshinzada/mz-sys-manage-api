const { poolSYS } = require("../../database");
const sql = require("mssql");

const getVisitDay = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS.request().query(`SELECT*FROM CLIENT_VISITS`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

const getVisitDayBySearch = async (value) => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .input("name", sql.VarChar, `%${value}%`)
      .query(`SELECT*FROM CLIENT_VISITS WHERE NAME LIKE @name`);
    return result.recordset;
  } catch (err) {
    throw err;
  } finally {
    poolSYS.release();
  }
};

module.exports = {
  getVisitDay,
  getVisitDayBySearch,
};
