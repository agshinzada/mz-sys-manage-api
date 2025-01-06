const { poolSYS } = require("../../database");
const sql = require("mssql");

const getVisitDay = async () => {
  try {
    await poolSYS.connect();
    const result = await poolSYS
      .request()
      .query(`SELECT*FROM ${process.env.CLIENT_VISIT_TABLE}`);
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
      .query(
        `SELECT*FROM ${process.env.CLIENT_VISIT_TABLE} WHERE NAME LIKE @name`
      );
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
